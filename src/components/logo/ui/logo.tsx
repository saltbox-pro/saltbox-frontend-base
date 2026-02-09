import { Link } from "react-router";

import logoSvg from "../assets/logo.svg";

import styles from "./logo.module.css";

interface LogoProps {
  onClick: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <Link className={styles.logoContainer} to="/core/minions" onClick={onClick}>
      <img className={styles.logo} src={logoSvg} alt="SALT.BOX" />
    </Link>
  );
}
