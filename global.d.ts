// For standard CSS imports (side-effect imports like: import './styles.css')
declare module "*.css";

// For CSS Modules (imports like: import styles from './styles.module.css')
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
