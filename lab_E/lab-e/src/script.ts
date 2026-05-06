const styles: string[] = ['style-1', 'style-2','style-3'];

const applyStyle = (styleName: string): void => {
    const oldLink = document.getElementById('dynamic-style');
    if (oldLink) {
        oldLink.remove();
    }

    const newLink = document.createElement('link');
    newLink.id = 'dynamic-style';
    newLink.rel = 'stylesheet';
    newLink.href = `/${styleName}.css`;
    
    document.head.appendChild(newLink);
};

const createStyleSwitcher = (): void => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const switcherContainer = document.createElement('div');
    switcherContainer.style.background = '#222';
    switcherContainer.style.padding = '15px';
    switcherContainer.style.display = 'flex';
    switcherContainer.style.justifyContent = 'center';
    switcherContainer.style.gap = '10px';
    switcherContainer.style.borderBottom = '3px solid #ff00ff';

    styles.forEach((style) => {
        const btn = document.createElement('button');
        btn.innerText = `Włącz: ${style}`;
        btn.style.padding = '10px 20px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        
        btn.onclick = () => applyStyle(style);
        
        switcherContainer.appendChild(btn);
    });

    nav.after(switcherContainer);
};

document.addEventListener('DOMContentLoaded', () => {
    createStyleSwitcher();
    applyStyle(styles[0]);
});

alert("Hello!");