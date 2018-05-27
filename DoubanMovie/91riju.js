window.onload = () => {
    const articleElement = document.getElementsByClassName('single-article')['0'];
    if (!articleElement) return;
    const nameNode = articleElement.childNodes[4];
    const name = nameNode.innerText.match(/(\S+)(基本信息)/)[1];

    getMovieInfoFromDouban(name, (info) => {
        let detailElement = articleElement.childNodes[5];
        if (detailElement.localName !== 'p') {
            detailElement = detailElement.getElementsByTagName('p')[0];
        }

        const url = `https://www.douban.com/search?cat=1002&q=${name}`;
        const rateElement = document.createElement('span');
        rateElement.innerHTML = `\n豆瓣评分：${info}`;
        const brElement = document.createElement('br');
        const brElement1 = document.createElement('br');
        const linkElement = document.createElement('span');
        linkElement.innerHTML = `豆瓣链接：<a href=${url} target="_blank">${url}</a>`;

        detailElement.appendChild(brElement);
        detailElement.appendChild(rateElement);
        detailElement.appendChild(brElement1);
        detailElement.appendChild(linkElement);
    });
}

function getMovieInfoFromDouban(name, showMovieInfo) {
    if (!name) {
        return;
    }

    const url = `https://www.douban.com/search?cat=1002&q=${name}`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (response) => {
            const html = document.createElement('html');
            html.innerHTML = response.responseText;
            const resultList = html.getElementsByClassName('result-list');
            if (!resultList || resultList.length === 0) return;
            const rateInfo = resultList['0'].getElementsByClassName('rating-info');
            if (!rateInfo || rateInfo.length === 0) return;
            const info = [...rateInfo['0'].childNodes].reduce(((accumulator, currentValue, currentIndex) => {
                const info = currentValue.innerText || '';
                return currentIndex === 0 ? '' : `${accumulator} ${info}`;
            }), '');
            showMovieInfo(info);
        }
    });
}