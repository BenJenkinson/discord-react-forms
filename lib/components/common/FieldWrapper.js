/* @flow */

import React, {PropTypes} from 'react';
import styles from '../../styles/common/FieldWrapper.css';

type FieldWrapperType = {
  error: string | ReactClass<any>;
  required: boolean;
  children?: any;
  label: ?string;
};

const FieldWrapper = ({error, displayError, required, label, className, children, ...rest}: FieldWrapperType) => (
  <div className={`${styles.field} ${className}`} {...rest}>
    {required || label ?
      <div className={styles.requiredLabelWrapper}>
        {required ? <span className={styles.requiredStar}>* </span> : null}
        {label ? <label className={styles.label}>{label}</label> : null}
      </div> :
      null
    }
    {children}
    {error && displayError ? <div className={styles.error}>{error}</div> : null}
  </div>
);

FieldWrapper.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  required: PropTypes.bool,
  children: PropTypes.any,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default FieldWrapper;
