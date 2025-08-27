import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isLoggedIn()) {
    const claimReq = route.data['claim'] as Function

    if(claimReq){
      const claims = authService.getUserClaim()
      if(!claimReq(claims)){
        router.navigateByUrl("/signin")
        return false
      } 
    }

    return true
  } 

  router.navigateByUrl("/auth/login")
  return false
  
}
