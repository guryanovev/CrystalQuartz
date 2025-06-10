import { HtmlDefinition, View } from 'john-smith/view';
import { MainViewModel } from '../main.view-model';

export class MainFooterView implements View {
  constructor(private readonly viewModel: MainViewModel) {}

  template(): HtmlDefinition {
    return (
      <footer class="main-footer">
        <div class="pull-left">
          <div class="cq-version-container">
            CrystalQuartz Panel{' '}
            <span id="selfVersion" class="cq-version">
              {this.viewModel.environment.SelfVersion}
            </span>
          </div>
          <div class="cq-version-container visible-lg-block">
            Quartz.NET{' '}
            <span id="quartzVersion" class="cq-version">
              {this.viewModel.environment.QuartzVersion}
            </span>
          </div>
          <div class="cq-version-container visible-lg-block">
            Host Platform{' '}
            <span id="dotNetVersion" class="cq-version">
              {this.viewModel.environment.DotNetVersion}
            </span>
          </div>
        </div>

        <div class="pull-right">
          <span id="autoUpdateMessage">{this.viewModel.autoUpdateMessage}</span>
        </div>
      </footer>
    );
  }
}
