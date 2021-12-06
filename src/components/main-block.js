import { Dock } from 'primereact/dock';
import { Dialog } from 'primereact/dialog';

<Dialog>


</Dialog>

export const Mainblock = () => {

    const imgPath = 'showcase/demo/images/dock';
    const imgErrorPath = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png';

    const items = [
        {
            label: 'Finder',
            icon: () => <img alt="Finder" src={`${imgPath}/finder.svg`} onError={(e) => e.target.src = imgErrorPath} width="100%" />
        },
        {
            label: 'App Store',
            icon: () => <img alt="App Store" src={`${imgPath}/appstore.svg`} onError={(e) => e.target.src = imgErrorPath} width="100%" />
        },
        {
            label: 'Photos',
            icon: () => <img alt="Photos" src={`${imgPath}/photos.svg`} onError={(e) => e.target.src = imgErrorPath} width="100%" />
        },
        {
            label: 'Trash',
            icon: () => <img alt="trash" src={`${imgPath}/trash.png`} onError={(e) => e.target.src = imgErrorPath} width="100%" />
        }
    ];

    return (
        <Dock model={items} />
    );
}