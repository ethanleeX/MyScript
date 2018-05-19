// ==UserScript==
// @name         douban movie for FIX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FIX 查询豆瓣评分
// @author       Ethan Lee
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        http://www.zimuxia.cn/portfolio/*
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
        /* jshint ignore:end */
        /* jshint esnext: false */
        /* jshint esversion: 6 */
        $().ready(function(){
            const titleElement = document.getElementsByClassName('content-page-title')['0'];
            if (!titleElement) return;
            const name = titleElement.innerText;

            getMovieInfoFromDouban(name,(info)=>{
                const detailElement = document.getElementsByClassName('pl')['0'].parentNode;
                const rateElement = document.createElement('span');
                rateElement.className = 'pl';
                rateElement.innerHTML = `豆瓣评分：${info}`;
                const brElement = document.createElement('br');
                detailElement.appendChild(brElement);
                detailElement.appendChild(rateElement);
            });
        });

        function getMovieInfoFromDouban(name, showMovieInfo){
        const url = `https://www.douban.com/search?cat=1002&q=${name}`;
    GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: (response) => {
    const html = document.createElement('html');
    html.innerHTML = response.responseText;
    const resultList = html.getElementsByClassName('result-list');
    if(!resultList || resultList.length === 0) return;
    const rateInfo = resultList['0'].getElementsByClassName('rating-info');
    if(!rateInfo || rateInfo.length === 0) return;
    const info = [...rateInfo['0'].childNodes].reduce(((accumulator, currentValue, currentIndex)=>{
    const info = currentValue.innerText || '';
    return currentIndex === 0 ? '':`${accumulator} ${info}`;
    }),'');
    showMovieInfo(info);
    }
    });
    }
    /* jshint ignore:start */
    ]]></>).toString();
    var c = Babel.transform(inline_src, { presets: ["es2015", "es2016"] });
    eval(c.code);
    /* jshint ignore:end */
