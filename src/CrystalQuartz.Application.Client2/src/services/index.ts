import { Event } from 'john-smith/reactive/event';
import { Property, SchedulerEvent } from '../api';
import { ICommand } from '../commands/contracts';

export interface CommandResult {
  _ok: boolean;
  _err: string;
}

export interface ErrorInfo {
  errorMessage: string;
  details?: Property[];
  disconnected?: boolean;
}

export class CommandService {
  public readonly onCommandStart = new Event<ICommand<void>>();
  public readonly onCommandComplete = new Event<ICommand<void>>();
  public readonly onCommandFailed = new Event<ErrorInfo>();
  public readonly onEvent = new Event<SchedulerEvent>();
  public readonly onDisconnected = new Event<unknown>();

  private _minEventId = 0;

  public constructor(
    private readonly _url: string,
    private readonly _headers: { [key: string]: string } | null
  ) {}

  public resetEvents() {
    this._minEventId = 0;
  }

  public executeCommand<T>(command: ICommand<T>, suppressError: boolean = false): Promise<T> {
    const data: Record<string, string | null | undefined> = {
      ...command.data,
      ...{ command: command.code, minEventId: this._minEventId.toString() },
    };

    const formData: Record<string, string> = {};

    Object.keys(data).forEach((key) => {
      const datum = data[key];
      if (datum !== null && datum !== undefined) {
        formData[key] = datum;
      }
    });

    this.onCommandStart.trigger(command);

    return fetch(this._url, {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: this._headers ?? undefined,
    })
      .catch(() => {
        this.onDisconnected.trigger(null);

        return Promise.reject({
          disconnected: true,
          errorMessage: 'Server is not available',
        });
      })
      .then((res) => res.json())
      .then((response) => {
        const commandResult = <CommandResult>response;
        if (commandResult._ok) {
          const mappedResult = command.mapper ? command.mapper(response) : response;

          /* Events handling */
          const eventsResult = mappedResult as { Events?: SchedulerEvent[] };
          const events: SchedulerEvent[] | undefined = eventsResult.Events;

          if (events && events.length > 0) {
            for (let i = 0; i < events.length; i++) {
              this.onEvent.trigger(events[i]);
            }

            this._minEventId = events.reduce((acc, current) => Math.max(acc, current.id), 0);
          }

          return mappedResult;
        } else {
          return Promise.reject({
            errorMessage: commandResult._err,
            details: null,
          });
        }
      })
      .catch((reason) => {
        if (!suppressError || reason.disconnected) {
          this.onCommandFailed.trigger(reason);
        }

        return Promise.reject(reason);
      })
      .finally(() => {
        this.onCommandComplete.trigger(command);
      });
  }
}
