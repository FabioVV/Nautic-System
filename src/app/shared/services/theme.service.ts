/*

    Just a simple wrapper to save/load user defined theme stuff

*/


import { Injectable, inject } from '@angular/core';
import { USER_THEME_COLOR_OBJ, USER_THEME_STATE, USER_THEME_PRESET } from '../constants';
import { LayoutService } from '../../layout/service/layout.service';
import { $t } from '@primeng/themes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
    constructor() { }

    layoutService = inject(LayoutService)
    
    saveThemePreset(preset: string){
        localStorage.setItem(USER_THEME_PRESET, preset)
    }

    getThemePreset(){
        return localStorage.getItem(USER_THEME_PRESET)
    }


    saveThemeMode(layoutState: any){
        if(localStorage.getItem(USER_THEME_STATE)){
            const newThemeData = {
                ...JSON.parse(localStorage.getItem(USER_THEME_STATE) as string),
                ...layoutState
            }

            localStorage.setItem(USER_THEME_STATE, JSON.stringify(newThemeData))

            return
        }

        localStorage.setItem(USER_THEME_STATE, JSON.stringify(layoutState))
    }

    saveThemeSurfaceColorsMode(type: any, colorName: any, color: any){
        if(localStorage.getItem(USER_THEME_STATE)){
            let newThemeData = {...JSON.parse(localStorage.getItem(USER_THEME_STATE) as string)}

            if(type == 'primary'){
                newThemeData = {
                    ...newThemeData,
                    primary: colorName
                }
            } else {
                newThemeData = {
                    ...newThemeData,
                    surface: colorName
                }
            }
            localStorage.setItem(USER_THEME_STATE, JSON.stringify(newThemeData))
        } else {
            
            let data = {}

            if(type == 'primary'){
                data = {
                    primary: colorName
                }
            } else {
                data = {
                    surface: colorName
                }
            }
            localStorage.setItem(USER_THEME_STATE, JSON.stringify(data))

        }

        if(localStorage.getItem(USER_THEME_COLOR_OBJ)){
            let newThemeData = {...JSON.parse(localStorage.getItem(USER_THEME_COLOR_OBJ) as string)}

            if(type == 'primary'){
                newThemeData = {
                    ...newThemeData,
                    primary: color
                }
            } else {
                newThemeData = {
                    ...newThemeData,
                    surface: color
                }
            }

            localStorage.setItem(USER_THEME_COLOR_OBJ, JSON.stringify(newThemeData))

        } else {
            let data = {}

            if(type == 'primary'){
                data = {
                    primary: color
                }
            } else {
                data = {
                    surface: color
                }
            }
            localStorage.setItem(USER_THEME_COLOR_OBJ, JSON.stringify(data))
        }

    }

    loadThemeMode(){
        if(localStorage.getItem(USER_THEME_STATE)){
            const userTheme = JSON.parse(localStorage.getItem(USER_THEME_STATE) as string)
            this.layoutService.layoutConfig.update((state) => (
                { ...state, primary: userTheme.primary, 
                    surface: userTheme.surface, 
                    darkTheme: userTheme.darkTheme 
                }
            ));
            this.layoutService.onConfigUpdate() // Is it necessary?

        }
    }

    getCompleteTheme(){
        if(localStorage.getItem(USER_THEME_STATE)){
            return JSON.parse(localStorage.getItem(USER_THEME_STATE) as string)
        }

        return null
    }

    getCompleteColorObj(){
        if(localStorage.getItem(USER_THEME_COLOR_OBJ)){
            return JSON.parse(localStorage.getItem(USER_THEME_COLOR_OBJ) as string)
        }

        return null
    }
}

