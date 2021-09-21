// ==UserScript==
// @name                light.gg linking for DIM
// @name:zh             DIM 链接到 light.gg
// @name:zh-CN          DIM 链接到 light.gg
// @namespace           https://github.com/HZDeluxe
// @version             0.1.2
// @description         Add links to light.gg for DIM
// @description:zh      为DIM添加light.gg链接
// @description:zh-CN   为DIM添加light.gg链接
// @author              HZDeluxe
// @match               https://app.destinyitemmanager.com/*
// @match               https://beta.destinyitemmanager.com/*
// @grant               none
// ==/UserScript==

(function () {
    'use strict';

    let targetNode = null;
    const waitNode = function () {
        targetNode = document.querySelector('#app > div:first-child > div:first-child');
        if (!targetNode) {
            setTimeout(waitNode, 1000);
        } else {
            const observer = new MutationObserver(function (mutationsList) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList'
                        && mutation.addedNodes.length != 0
                        && mutation.addedNodes[0].classList.contains('item-popup')) {
                        const itemPopup = mutation.addedNodes[0];
                        const addLgg = function () {
                            if (itemPopup.querySelector('.btn-lgg')) {
                                return;
                            }
                            let item = null;
                            const itemNameElm = itemPopup.querySelector('a');
                            if (itemNameElm && itemNameElm.parentElement) {
                                const fiberKey = Object.keys(itemNameElm.parentElement).find(key => key.startsWith("__reactFiber$"));
                                if (fiberKey && itemNameElm.parentElement[fiberKey]) {
                                    const fiber = itemNameElm.parentElement[fiberKey];
                                    if (fiber && fiber.return && fiber.return.memoizedProps && fiber.return.memoizedProps.item) {
                                        item = fiber.return.memoizedProps.item;
                                    }
                                }
                            }
                            if (!item || item.name.toUpperCase() != itemNameElm.innerText.toUpperCase()) {
                                return;
                            }
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = '<a class="btn-lgg" style="float:right;margin-right:5px;" target="_blank" href="https://www.light.gg/db/items/' + item.hash + '/"><img src="data:image/webp;base64,UklGRlwBAABXRUJQVlA4TE8BAAAvD8ADEO/BoJEkRX34KOX9C2P+tsE4kmwl8z8uJxLwHLiRfzruj2XQSJKivrt//8pewEtgZmqDbCP1HvrV3uOFLpQFChQckAqUwh/x4T+AoAHB6pEjgUSBTCB7YIF8DCc/0DbnHtuh4H2xH7vzuoTgEPzv2JLPPp99plGvRrqPrECCi5IAdH89/C34Hwh+DxWQfH5OoJ/VWBdqjmzoS8wTcOgGKBxGkm1a59nWt2375x/YUwp3343ov8K2bZvsdFdnxKFAAFRXBiCEMSPA6fYHu9MqIYCJQGs07nVm2/t1Ssh9whyybKTbxzSfHTGF9G/DEWyvCaE7dqD9n5w1yG4roN8j/f96M/7XsTlAHbaN3/P9AeM/c3n2vf3crBY6bmoarG5ZzZLkug0qDsrRTB/blOwChyKY6fW+XjBe5JRzTFaHS8OLHKMCZ8lveIFzBAA=" /></a>';
                            itemNameElm.after(tempDiv.firstChild);
                        };
                        addLgg();
                        const subObserver = new MutationObserver(addLgg);
                        subObserver.observe(itemPopup, { attributes: true, subTree: true });
                    }
                }
            });
            observer.observe(targetNode, { childList: true });
        }
    };
    waitNode();
})();
