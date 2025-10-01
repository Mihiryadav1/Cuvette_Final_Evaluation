import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Layout.module.css"
const Layout = () => {
    const pathName = useLocation();
    const header = pathName.pathname.toUpperCase().slice(1) || "Home"
    return (
        <>
            <div className={styles["grid-layout"]}>
                <header className={styles['header']}>{header}</header>
                <aside className={styles['left']}><Sidebar /></aside>
                <aside className={styles["right"]}> <Outlet /></aside>
                <footer className={styles["footer"]}>Footer</footer>
            </div>
        </>
    )
}

export default Layout