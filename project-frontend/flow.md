Registration flow (frontend -> backend -> DB)

1) User opens `app/(public)/register/page.tsx`.
2) User selects role (buyer/seller/admin) and submits the form.
3) Frontend validates input with Zod in `lib/validation.ts`.
4) Frontend sends Axios request:
   - Buyer: `POST {API_BASE}/auth/register/buyer` with JSON body.
   - Seller: `POST {API_BASE}/auth/register/seller` with JSON body.
   - Admin: `POST {API_BASE}/auth/register/admin` with `FormData` (optional image file).
   - `withCredentials: true` is enabled on all these calls.
5) Backend receives in `src/auth/auth.controller.ts`:
   - Buyer/seller: DTO validation via class-validator on `CreateBuyerDto`/`CreateSellerDto`.
   - Admin: `FileInterceptor` handles optional file; DTO validation on `CreateAdminDto`.
6) `AuthService` hashes the password with bcrypt, saves to DB, sends email, returns JSON like `{ message, id, email }`.
7) Frontend shows success toast and redirects to `/login`.

Login flow (frontend -> backend -> cookie)

1) User opens `app/(public)/login/page.tsx`.
2) Frontend validates input with Zod (`loginSchema`).
3) Frontend sends `POST {API_BASE}/auth/login` with JSON `{ email, password }` and `withCredentials: true`.
4) Backend `AuthService.login()` checks buyer -> seller -> admin, compares bcrypt hash.
5) On success, backend creates JWT and sets it as httpOnly cookie:
   - cookie name: `access_token`
   - options: `httpOnly`, `secure` in production, `sameSite: 'lax'`, `maxAge: 7 days`
6) Backend returns `{ message: 'Logged in' }`.
7) Frontend shows success toast and redirects to `/products`.
