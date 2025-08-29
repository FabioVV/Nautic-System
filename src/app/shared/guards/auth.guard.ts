import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    if (authService.isLoggedIn()) {

        if ('code' in route.data) {
            const code = route.data['code'] as string

            if (authService.parseUserJwt()?.permissions.includes(code)) {
                return true
            } else {
                return false
            }
        }

        return true
    }

    router.navigateByUrl("/auth/login")
    return false

}
