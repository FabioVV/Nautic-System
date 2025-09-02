import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    if (authService.isLoggedIn()) {

        if ('code' in route.data) {
            const code = route.data['code'] as string
            const useaPermissions = authService.parseUserJwt()?.permissions
            const userRoles = authService.parseUserJwt()?.roles

            if (useaPermissions.includes(code) || (userRoles.includes("admin"))) {
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
