import { Avatar } from '@material-ui/core'
import React from 'react'
import "./SidebarChat.css"

function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar/>
            <div className="sidebarChat__info">
                <h2>Demo Room</h2>
                <p>This should show the last message</p>
            </div>
        </div>
    )
}

export default SidebarChat
