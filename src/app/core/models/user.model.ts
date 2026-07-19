/**
 * Interface representing the logged-in User structure.
 * Este modelo será utilizado pelo AuthService para controle de sessão.
 */
export interface User {
  id: string;
  email: string;
  name: string;
}
