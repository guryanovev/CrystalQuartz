import { map } from 'john-smith/reactive/transformers/map';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { MainAsideViewModel } from './aside.view-model';

export class MainAsideView implements View {
  constructor(private readonly viewModel: MainAsideViewModel) {}

  template(): HtmlDefinition {
    const gaugeStyle = map(this.viewModel.inProgressCount, (value) => {
      const angle = (180 * value) / parseInt(this.viewModel.jobsTotal.getValue() ?? '0', 10);

      return 'transform: rotate(' + Math.min(angle, 180) + 'deg)';
    });

    return (
      <aside class="main-aside">
        <ul>
          <li>
            <span class="aside-value-title">Uptime</span>
            <span class="aside-value">
              <span class="value-number">{this.viewModel.uptime.value}</span>
            </span>
            <span class="value-measurement-unit">{this.viewModel.uptime.measurementUnit}</span>
          </li>
          <li>
            <span class="aside-value-title">Total Jobs</span>
            <span class="aside-value js_totalJobs">{this.viewModel.jobsTotal}</span>
          </li>
          <li>
            <span class="aside-value-title">Executed</span>
            <span class="aside-value js_executedJobs">{this.viewModel.jobsExecuted}</span>
            <span class="value-measurement-unit">jobs</span>
          </li>

          <li>
            <span class="aside-value-title">In progress</span>

            <div class="aside-value">
              <section class="gauge">
                <div class="gauge-body" style={gaugeStyle}>
                  <div class="gauge-scale"></div>
                  <div class="gauge-value"></div>
                  <div class="gauge-center"></div>
                </div>
              </section>
              <div class="gauge-legend js_inProgressCount">{this.viewModel.inProgressCount}</div>
            </div>

            <span class="value-measurement-unit">jobs</span>
          </li>
        </ul>
      </aside>
    );
  }

  // init(dom: js.IDom, viewModel: MainAsideViewModel) {
  //     //dom('.js_uptimeValue').observes(viewModel.uptimeValue, { encode: false });
  //     dom('.js_uptimeMeasurementUnit').observes(viewModel.uptime.measurementUnit);
  //
  //     dom('.js_totalJobs').observes(viewModel.jobsTotal);
  //     dom('.js_executedJobs').observes(viewModel.jobsExecuted);
  //     dom('.js_inProgressCount').observes(viewModel.inProgressCount);
  //
  //     const $gaugeBody = dom('.gauge-body').$;
  //     dom.manager.manage(viewModel.inProgressCount.listen(value => {
  //         const angle = 180 * value / parseInt(viewModel.jobsTotal.getValue(), 10);
  //
  //         $gaugeBody.css('transform', 'rotate(' + Math.min(angle, 180) + 'deg)');
  //     }));
  //
  //     const $uptimeValue = dom('.js_uptimeValue').$;
  //     dom.manager.manage(viewModel.uptime.value.listen(value => {
  //         if (value === null) {
  //             $uptimeValue.addClass('empty');
  //             $uptimeValue.text('none');
  //         } else {
  //             $uptimeValue.removeClass('empty');
  //             $uptimeValue.text(value);
  //         }
  //     }));
  // }
}
