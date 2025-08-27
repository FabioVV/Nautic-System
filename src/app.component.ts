import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './app/shared/services/theme.service';
import { AppConfigurator } from './app/layout/component/app.configurator';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    providers: [AppConfigurator],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    constructor(private themeService: ThemeService, private appConfig: AppConfigurator) {
        themeService.loadThemeMode()
        const colorObj = themeService.getCompleteColorObj()

        if (colorObj) {
            if (colorObj.surface) {
                appConfig.applyTheme('surface', colorObj.surface)
            }

            if (colorObj.primary) {
                appConfig.applyTheme('primary', colorObj.primary)
            }
        }

        themeService.layoutService.onConfigUpdate()
    }
}
