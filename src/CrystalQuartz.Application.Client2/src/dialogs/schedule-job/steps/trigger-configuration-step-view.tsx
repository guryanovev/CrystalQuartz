import { Disposable, OptionalDisposables } from 'john-smith/common';
import { map } from 'john-smith/reactive/transformers/map';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List } from 'john-smith/view/components/list';
import { Value } from 'john-smith/view/components/value';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';
import { JobDataMapItemView } from '../../common/job-data-map-item-view';
import { ValidatorView } from '../../common/validation/validator-view';
import { TriggerConfigurationStep } from './trigger-configuration-step';

export class TriggerConfigurationStepView implements View, OnInit, Disposable {
  public constructor(private readonly viewModel: TriggerConfigurationStep) {}

  public onInit(_: DomElement | null, __: DomEngine): OptionalDisposables {}

  public dispose() {
    this.viewModel.dispose();
  }

  public template(): HtmlDefinition {
    return (
      <div>
        <h2 class="dialog-header">Trigger Configuration</h2>
        <form class="cq-form form-horizontal">
          <div class="cq-form-group row">
            <label for="triggerName" class="col col-sm-3 control-label">
              Trigger Name:
            </label>
            <div class="col-sm-9">
              <input
                id="triggerName"
                type="text"
                class="triggerName form-control form-control-sm"
                $value={this.viewModel.triggerName}
              />

              <p class="cq-field-description">
                Optional trigger friendly name. Quartz will generate a guid if empty.
              </p>
            </div>
          </div>

          <div class="cq-form-separator"></div>

          <div class="cq-form-group row">
            <label for="triggerType" class="col col-sm-3 control-label">
              Trigger Type:
            </label>
            <div class="col col-sm-9">
              <select
                id="triggerType"
                class="form-select form-select-sm triggerType"
                $value={this.viewModel.triggerType}
              >
                <option value="Simple">Simple</option>
                <option value="Cron">Cron</option>
              </select>
            </div>
          </div>

          <Value
            view={(triggerType) => {
              if (triggerType === 'Simple') {
                return (
                  <div class="simpleTriggerDetails">
                    <div class="cq-form-group row">
                      <label for="repeatCount" class="col col-sm-3 col-xs-12 control-label">
                        Repeat Count
                        <Value
                          view={(repeatForever) => (repeatForever ? undefined : <sup>*</sup>)}
                          model={this.viewModel.repeatForever}
                        ></Value>
                        :
                      </label>
                      <div class="col col-sm-5 col-xs-8 repeatCountContainer">
                        <input
                          id="repeatCount"
                          type="text"
                          class="form-control form-control-sm repeatCount"
                          disabled={map(this.viewModel.repeatForever, (value) =>
                            value ? 'disabled' : undefined
                          )}
                          $className={{
                            'cq-error-control': this.viewModel.repeatCountValidator.failed,
                          }}
                          $value={this.viewModel.repeatCount}
                        />
                        <Value
                          view={ValidatorView}
                          model={this.viewModel.repeatCountValidator}
                        ></Value>
                      </div>
                      <div class="col col-sm-4 col-xs-4">
                        <div class="form-check">
                          <input
                            id="repeatForever"
                            type="checkbox"
                            class="form-check-input"
                            $checked={this.viewModel.repeatForever}
                          />
                          <label class="form-check-label" for="repeatForever">
                            Repeat forever
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="cq-form-group row">
                      <label class="col col-sm-3 col-xs-12 control-label" for="repeatInterval">
                        Repeat Every<sup>*</sup>:
                      </label>

                      <div class="col col-sm-5 col-xs-6 repeatIntervalContainer">
                        <input
                          id="repeatInterval"
                          type="text"
                          class="form-control form-control-sm repeatInterval"
                          $className={{
                            'cq-error-control': this.viewModel.repeatIntervalValidator.failed,
                          }}
                          $value={this.viewModel.repeatInterval}
                        />
                        <Value
                          view={ValidatorView}
                          model={this.viewModel.repeatIntervalValidator}
                        ></Value>
                      </div>

                      <div class="col col-sm-4 col-xs-6">
                        <select
                          class="form-select form-select-sm repeatIntervalType"
                          $value={this.viewModel.repeatIntervalType}
                        >
                          <option>Milliseconds</option>
                          <option>Seconds</option>
                          <option>Minutes</option>
                          <option>Hours</option>
                          <option>Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              }

              if (triggerType === 'Cron') {
                return (
                  <div class="cronTriggerDetails">
                    <div class="cq-form-group row">
                      <label for="cronExpression" class="col col-sm-3 control-label">
                        Cron Expression<sup>*</sup>:
                      </label>
                      <div class="col col-sm-9">
                        <input
                          id="cronExpression"
                          type="text"
                          class="form-control form-control-sm cronExpression"
                          $className={{
                            'cq-error-control': this.viewModel.cronExpressionValidator.failed,
                          }}
                          $value={this.viewModel.cronExpression}
                        />
                        <Value
                          view={ValidatorView}
                          model={this.viewModel.cronExpressionValidator}
                        ></Value>
                        <p class="cq-field-description">
                          Read more about cron format at{' '}
                          <a
                            target="_blank"
                            href="https://www.quartz-scheduler.net/documentation/quartz-2.x/tutorial/crontrigger.html"
                          >
                            Quartz.NET docs
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            }}
            model={this.viewModel.triggerType}
          ></Value>

          <div class="cq-form-separator"></div>

          <div class="cq-form-group row">
            <label for="cronExpression" class="col col-sm-3 control-label">
              Job Data Map:
            </label>

            <div class="col col-sm-5 js_jobDataKeyContainer">
              <input
                type="text"
                class="js_jobDataKey form-control form-control-sm"
                placeholder="Enter new key"
                $value={[this.viewModel.newJobDataKey, 'input']}
              />
            </div>

            <div class="col col-sm-4">
              <button
                class="btn btn-light btn-sm"
                disabled={map(this.viewModel.canAddJobDataKey, (value) =>
                  value ? undefined : 'disabled'
                )}
                _click={() => this.viewModel.addJobDataMapItem()}
              >
                Add Key
              </button>
            </div>
          </div>

          <Value
            view={(jobDataMapKeys) => {
              if (jobDataMapKeys > 0) {
                return (
                  <div class="cq-form-group row">
                    <section class="col col-sm-3"></section>
                    <section class="col col-sm-9">
                      <table class="job-data-map-input">
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th class="job-data-remove"></th>
                          </tr>
                        </thead>
                        <tbody class="js_jobDataMap">
                          <List view={JobDataMapItemView} model={this.viewModel.jobDataMap}></List>
                        </tbody>
                      </table>
                    </section>
                  </div>
                );
              }
            }}
            model={this.viewModel.jobDataMap.count()}
          ></Value>
        </form>
      </div>
    );
  }
}
