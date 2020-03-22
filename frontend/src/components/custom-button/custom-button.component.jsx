import React from 'react'

import './custom-button.styles.scss'

const CustomButton = ({children, color}) => (
    <button className={`${color} custom-button`}>
        {children}
    </button>
)

export default CustomButton;