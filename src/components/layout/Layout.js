import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

function Layout(props) {
    return (
        <div>
            <MainNavigation isLogin={props.isLogin} handleLogoutGoogle={props.handleLogoutGoogle} userName={props.userName} />
            <main className={classes.main}>{props.children}</main>
        </div>
    );
}

export default Layout;
