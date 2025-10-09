import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    let clone: any


    if (authService.isLoggedIn()) {
        let url = req.url.split(`/`)
        let last_url_portion = url[url.length - 1]
        if (last_url_portion == `boat-file`) {
            clone = req.clone({
                headers: req.headers
                    .set('Authorization', 'Bearer ' + authService.getUserToken())
            })

        } else {
            clone = req.clone({
                headers: req.headers
                    .set('Authorization', 'Bearer ' + authService.getUserToken())
                    .set('Content-Type', 'application/json')

            })
        }

        // clone = req.clone({
        //     headers: req.headers
        //         .set('Authorization', 'Bearer ' + authService.getUserToken())
        //         .set('Content-Type', 'application/json')

        // })


        return next(clone)
    }

    return next(req)
}
