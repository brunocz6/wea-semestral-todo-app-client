import styled from "@emotion/styled";
import { LocalizationProvider } from "@mui/lab";
import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import theme from "../../styles/theme";
import DateAdapter from '@mui/lab/AdapterMoment';

/** Styl pozadí */
const Gradient = styled.div`
    background: linear-gradient(149deg, rgba(2,184,147,1) 0%, rgba(39,160,221,1) 50%, rgba(194,39,194,1) 100%);
    height: 100vh;
    width: 100vw;
`;

/**
 * Komponenta - rozložení aplikace.
 */
const Layout: FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={DateAdapter}>
            {/* Obsah z children komponenty */}
            <Gradient>
                {children}
            </Gradient>
        </LocalizationProvider>
    </ThemeProvider>
);

Layout.displayName = "LayoutComponent";
export default Layout;