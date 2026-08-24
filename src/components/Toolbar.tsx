import React from "react";

export function Toolbar() {
    return (
        <header className="toolbar">
            <button>New</button>
            <button>Open</button>
            <button>Save</button>

            <div className="toolbar-spacer" />

            <button>Export</button>
        </header>
    );
}