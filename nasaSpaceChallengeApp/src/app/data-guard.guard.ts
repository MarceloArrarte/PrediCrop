import { CanActivateFn } from '@angular/router';

export const dataGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
