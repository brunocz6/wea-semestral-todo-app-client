import axios from "axios";
import defaultHeader from "../common/default-request-header";
import { API_FULL_ROUTES } from "../config";
import CONFIG from "../config/default";

/**
 * Třída pro správu uživatelského účtu.
 */
class AuthorizationService {

    /**
     * Pokusí se přihlásit uživatele na základě předaných údajů.
     * @param email Přihlašovací e-mail
     * @param password Heslo uživatele
     * @returns Odpověď od serveru
     */
    login = (email: string, password: string) => {
        return axios
            .post(API_FULL_ROUTES.sessions, {
                email,
                password,
            })
            .then(res => {
                if (res.status === 200) {
                    const { accessToken, refreshToken } = res.data;

                    localStorage.setItem(
                        CONFIG.userStorageKey,
                        JSON.stringify({
                            email,
                            accessToken,
                            refreshToken
                        })
                    );
                }

                return res.data;
            });
    };

    /**
     * Pokusí se o registraci uživatele s předanými údaji.
     * @param name Jméno uživatele
     * @param email E-mail uživatele (slouží pro přihlášení)
     * @param password Heslo uživatele
     * @param passwordConfirmation Potvrzení hesla uživatele (musí být stejné jako password)
     * @returns Vrací Promise dotazu pro registraci uživatele.
     */
    register = (name: string, email: string, password: string, passwordConfirmation: string) => {
        return axios
            .post(API_FULL_ROUTES.users, {
                name,
                email,
                password,
                passwordConfirmation
            });
    };

    /**
     * Odhlásí uživatele.
     */
    logout = () => {
        return axios
            .delete(API_FULL_ROUTES.sessions, {
                headers: this.getAuthHeader()
            })
            .then(() => {
                localStorage.removeItem(CONFIG.userStorageKey);
            });
    };

    /**
     * Pokusí se vrátit přihlášeného uživatele (počítá i s tím, že uživatel nemusí být přihlášený).
     * @returns Objekt přihlášeného uživatele nebo null (pokud není přihlášený).
     */
    getCurrentUser = () => {
        const userJson = localStorage.getItem(CONFIG.userStorageKey);

        if (userJson) {
            return JSON.parse(userJson);
        }

        return null;
    };

    /**
     * Vrací výchozí hlavičku dotazu (včetně polí nutných pro autorizaci, pokud je uživatel přihlášený).
     */
    getAuthHeader = () => {
        return this.extendWithAuthHeader(defaultHeader);
    }

    /**
     * Rozšíří předanou hlavičku dotazu o pole nutná pro autorizaci uživatele.
     * @param header Původní hlavička dotazu
     */
    extendWithAuthHeader = (header: any) => {
        const user = this.getCurrentUser();

        if (user && user.accessToken && user.refreshToken) {
            return {
                ...header,
                "Authorization": `Bearer ${user.accessToken}`,
                "x-refresh": user.refreshToken
            };
        }

        return header;
    }
}

export default new AuthorizationService();