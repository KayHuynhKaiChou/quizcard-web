import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // List of URLs that don't need Authorization header
  const publicUrls = ['/account/sign-in', '/account/sign-up', '/account/forgot-password'];
  
  // Check if current request is to a public endpoint
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));
  
  // If it's a public URL, skip adding Authorization header
  if (isPublicUrl) {
    return next(req);
  }
  
  // For protected URLs, add Authorization header if token exists
  const token = authService.getToken();
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  return next(req);
};
