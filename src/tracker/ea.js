/**
 * Created by andrew on 17/2/14.
 */

import EAJS from '../analytics'

/**
 * Google integration
 *
 *
 */


(function (m, l, n, d) {
    m.google = {

        /**
         * 获取跟踪器
         * @param config
         * @returns {Array}
         */
        getTracker: function (config) {
            // 是否配置了GA
            if (typeof config.accounts.google === 'undefined') {
                return null;
            }

            // 创建GA对象
            if (typeof ga !== 'object') {
                // 此处GA已经创建为全局对象
                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

                var opts = {
                    trackingId: config.accounts.google,
                    cookieDomain: 'auto',
                    name: 'ea'
                };

                // 配置cookieDomain
                if (typeof config.cookieDomain === 'string') {
                    opts.cookieDomain = config.cookieDomain;
                }

                ga('create', opts);
                ga('ea.require', 'displayfeatures');
                ga('ea.require', 'ec', 'ec.js');
            }

            return ga;
        },

        /**
         * 向服务器发送数据
         * @param pageview
         * @returns {boolean}
         */
        send: function (pageview) {
            if (typeof pageview != 'object') {
                return false;
            }

            // 提取数据
            var data = pageview[1];
            if (typeof data === 'undefined') {
                return false;
            }

            // 提取配置
            if (typeof data.config === 'object') {
                EAJS.config = data.config;
            }

            // 获取跟踪器
            var ga = this.getTracker(EAJS.config);
            if (ga == null) {
                return false;
            }

            // 设置会话数据
            //*********************************************************************************************************


            // 提取用户
            if (typeof data.user === 'object') {
                EAJS.user = data.user;

                // 多次调用setUserId会报错
                ga('ea.set', 'userId', EAJS.user.uid + "");
            }

            // 设置用户
            if (EAJS.user.uid) {
                // 用户类型
                // if (typeof EAJS.user.type === 'string') {
                //     ga('ea.set', 'dimension1', EAJS.user.type);
                // }
                ga('ea.set', 'dimension4', 'registered');
                // 新用户注册
                // if (EAJS.user.isnew) {
                //     ga('ea.send', 'event',
                //         'User',
                //         'Register'
                //     );
                // }
            } else {
                ga('ea.set', 'dimension4', 'guest');
            }

            //设置页面类型

            if (!!data.pageType) {
                ga('ea.set', 'dimension3', data.pageType);
                ga('ea.set', 'contentGroup1', data.pageType);
            } else {
                ga('ea.set', 'dimension3', 'others');
                ga('ea.set', 'contentGroup1', 'others');
            }


            // 设置业务数据
            //*********************************************************************************************************

            // 合并分类数组为字符串
            var joincate = function (category) {
                if (typeof category === 'object') {
                    return category.join('/');
                }
                return category;
            }

            // 是否发送pageview的标志
            var sendpv = true;

            // 衡量搜索
            if (typeof data.search === 'object') {
                ga('ea.send', 'pageview');
                for (var i in data.search.items) {
                    var product = data.search.items[i];

                    ga('ea.ec:addImpression', {
                        'id': product.id,
                        'name': product.name,
                        'category': product.category,
                        'list': decodeURIComponent(document.location.pathname+location.hash),
                        'position': String(i),
                        'dimension1': String(data.search.items.length)
                    });
                }

                ga('ea.send', 'event',
                    'emerchandising',
                    'product list view',
                    decodeURIComponent(document.location.pathname+location.hash),
                    {'nonInteraction': true}
                );

                sendpv = false
            }

            // 衡量产品展示
            if (typeof data.products === 'object') {
                ga('ea.send', 'pageview');

                for (var i in data.products.items) {
                    var product = data.products.items[i];

                    ga('ea.ec:addImpression', {         // Provide product details in an impressionFieldObject.
                        'id': product.sku,           // Product ID (string).
                        'name': product.title,       // Product name (string).
                        'category': joincate(product.category),// Product category (string).
                        // 'brand': product.brand,      // Product brand (string).
                        // 'variant': product.variant,  // Product variant (string).
                        // 'price': product.price,      // Product price.
                        'list': document.location.pathname+location.hash,  // Product list (string).
                        'position': Number(i) + 1,           // Product position (number).
                        'dimension1': data.products.items.length + ''
                    });


                }

                ga('ea.send', 'event', 'emerchandising', 'product list view', document.location.pathname+location.hash, {'nonInteraction': true});
                sendpv = false;
            }

            // 衡量产品列表查看
            if (typeof data.category === 'object') {
                // GA 不支持
            }

            // 衡量产品详情查看
            if (typeof data.product === 'object') {
                ga('ea.send', 'pageview');

                var product = data.product;

                ga('ea.ec:addProduct', {
                    'id': product.sku,
                    'name': product.title,
                    'category': joincate(product.category),
                    // 'brand': product.brand,
                    // 'variant': product.variant,
                    // 'price': product.price
                });

                ga('ea.ec:setAction', 'detail');
                ga('ea.send', 'event', 'emerchandising', 'see product detail', product.title, {'nonInteraction': true});
                sendpv = false
            }

            // 衡量购物车
            if (typeof data.cart === 'object') {


                // 跟踪购物车当前状态

                // 跟踪购物车操作
                if (typeof data.cart.action === 'string' && typeof data.cart.product === 'object') {
                    var product = data.cart.product;
                    console.warn('cart ', product)
                    ga('ea.ec:addProduct', {
                        'id': product.sku,
                        'name': product.title,
                        'category': joincate(product.category),
                        // 'brand': product.brand,
                        // 'variant': product.variant,
                        // 'price': product.price,
                        'quantity': product.quantity
                    });
                    ga('ea.ec:setAction', data.cart.action.toLowerCase());

                    // 以事件发送
                    ga('ea.send', 'event',
                        'emerchandising',
                        data.cart.action,
                        product.title,
                    );

                    sendpv = false;
                }
            }

            // 衡量结账流程
            if (typeof data.checkout === 'object') {
                ga('ea.send', 'pageview');

                for (var i in data.checkout.items) {
                    var product = data.checkout.items[i];

                    ga('ea.ec:addProduct', {
                        'id': product.sku,
                        'name': product.title,
                        'category': joincate(product.category),
                        // 'brand': product.brand,
                        // 'variant': product.variant,
                        // 'price': product.price,
                        'quantity': product.quantity
                    });
                }

                ga('ea.ec:setAction', 'checkout', {
                    'step': data.checkout.step,
                });
                ga('ea.send', 'event', 'emerchandising', 'checkout', 'step' + data.checkout.step, {'nonInteraction': true});
                sendpv = false
            }

            // 衡量交易
            if (typeof data.order === 'object') {
                ga('ea.set', 'dimension2', data.order.payType);
                ga('ea.send', 'pageview');
                for (var i in data.order.items) {
                    var product = data.order.items[i];

                    ga('ea.ec:addProduct', {
                        'id': product.sku,
                        'name': product.title,
                        'category': joincate(product.category),
                        // 'brand': product.brand,
                        // 'variant': product.variant,
                        // 'coupon': product.coupon,
                        'price': product.price,
                        'quantity': product.quantity
                    });
                }

                ga('ea.ec:setAction', 'purchase', {
                    'id': data.order.orderId,
                    // 'affiliation': data.order.affiliation,
                    'revenue': data.order.groundTotal,
                    'tax': data.order.tax,
                    'shipping': data.order.shipping,
                    'dimension6':data.order.payType
                    // 'coupon': data.order.coupon
                });

                sendpv = false
            }

            // 衡量退款
            if (typeof data.refund === 'object') {


                if (typeof data.refund.items === 'object') {
                    for (var i in data.refund.items) {
                        var product = data.refund.items[i];

                        ga('ea.ec:addProduct', {
                            'id': product.sku,
                            'quantity': product.quantity
                        });
                    }
                }

                ga('ea.ec:setAction', 'refund', {
                    'id': data.refund.orderId,
                });
            }

            // 衡量促销信息展示
            if (typeof data.promotes === 'object') {


                for (var i in data.promotes) {
                    var promote = data.promotes[i];

                    ga('ea.ec:addPromo', {
                        'id': promote.id,              // Promotion ID. Required (string).
                        'name': promote.name,          // Promotion name (string).
                        'creative': promote.creative,  // Creative (string).
                        'position': promote.position   // Position  (string).
                    });
                }
            }

            // 衡量点击事件
            if (typeof data.click === 'object') {

                //衡量tab按钮点击


                // 衡量产品点击
                if (typeof data.click.product === 'object') {


                    var product = data.click.product;

                    ga('ea.ec:addProduct', {
                        'id': product.sku,
                        'name': product.title,
                        'category': joincate(product.category),
                        // 'brand': product.brand,
                        // 'variant': product.variant,
                        // 'price': product.price,
                        'position': product.position,
                        'dimension1': product.counts
                    });

                    ga('ea.ec:setAction', 'click', {
                        'list': decodeURIComponent(document.location.pathname+location.hash)

                    });

                    // Send click with an event.
                    ga('ea.send', 'event', 'emerchandising', 'product list click', decodeURIComponent(document.location.pathname+location.hash));
                    sendpv = false;
                }

                // 衡量结账页面点击
                if (typeof data.click.checkout === 'object') {


                    var checkout = data.click.checkout;
                    ga('ea.ec:setAction', 'checkout_option', {
                        'step': checkout.step + '',
                        // 'option': checkout.option
                    });

                    // Send click with an event.
                    // ga('ea.send', 'event', 'Checkout', 'Option', checkout.option);
                    ga('ea.send', 'event', 'emerchandising', 'checkout', 'step' + checkout.step, {'nonInteraction': true});
                    sendpv = false;
                }

                // 衡量促销信息点击
                if (typeof data.click.promote === 'object') {


                    var promote = data.click.promote;

                    ga('ea.ec:addPromo', {
                        'id': promote.id,              // Promotion ID. Required (string).
                        'name': promote.name,          // Promotion name (string).
                        'creative': promote.creative,  // Creative (string).
                        'position': promote.position   // Position  (string).
                    });

                    ga('ea.ec:setAction', 'promo_click');

                    // Send click with an event.
                    ga('ea.send', 'event', 'Promotion', 'Click', promote.name);
                    sendpv = false;
                }
            }

            // 衡量自定义事件
            if (typeof data.event === 'object') {
                ga('ea.send', 'event',
                    data.event.category,
                    data.event.action,
                    data.event.label,
                    data.event.value
                );


                sendpv = false;
            }


            // 提交数据
            //*********************************************************************************************************

            // 页面浏览
            if (sendpv) {
                // 设置页面地址
                if (typeof data.url === 'string') {
                    ga('ea.set', 'page', data.url);
                }
                // 设置页面标题
                if (typeof data.title === 'string') {
                    ga('ea.set', 'title', data.title);
                }


                ga('ea.send', 'pageview');
            }

            // Log
            EAJS.log('GA', data);
        }
    };

    // Process pageviews after analytics.js loaded
    var dataList = m.getInput('ea.send');
    for (var i in dataList) {
        m.google.send(dataList[i]);
    }

    // Process pageviews after new are added
    document.addEventListener('eventAddedToJackWolfQueue', function (e) {
        m.google.send(e.detail);
    });

})(EAJS, location, navigator, document);


(function (m, l, n, d) {
    m.baidu = {

        getTracker: function (config) {

            if (typeof config.accounts.baidu == 'undefined' || config.accounts.baidu == '') {
                return null;
            }

            if (typeof _hmt !== 'object') {
                window._hmt = []

                _hmt.push(['_setAccount', config.accounts.baidu])
                _hmt.push(['_setAutoPageview', false]);
                _hmt.push(['_setCustomVar', 1, EAJS.pageType, EAJS.user.uid ? 'register' : 'guest', 1]);
                (function () {
                    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
                    var u = _bdhmProtocol + "hm.baidu.com/h.js?" + config.accounts.baidu;
                    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                    g.type = 'text/javascript';
                    g.async = true;
                    g.defer = true;
                    g.src = u;
                    s.parentNode.insertBefore(g, s);
                })();

            }

            return _hmt


        },
        send: function (pageview) {

            if (typeof pageview != 'object') {

                return false;
            }

            var data = pageview[1]


            if (typeof  data === 'undefined') {
                return false;
            }

            if (typeof data.config === 'object') {
                EAJS.config = data.config
            }

            var _hmt = this.getTracker(EAJS.config);
            if (_hmt == null) {

                return false;
            }

            // 合并分类数组为字符串
            var joincate = function (category) {
                if (typeof category === 'object') {
                    return category.join('>');
                }
                return category;
            }

            if (typeof data.order === 'object') {

                var orderInfo = {
                    orderId: data.order.orderId,
                    orderTotal: data.order.groundTotal,
                    item: []
                }

                for (var i in data.order.items) {
                    var item = data.order.items[i];

                    orderInfo.items.push({
                        skuId: item.sku,
                        skuName: item.title,
                        category: joincate(item.category),
                        Price: item.price,
                        Quantity: item.quantity
                    })
                }

                _hmt.push(['_trackOrder', orderInfo]);
            }


            _hmt.push(['_trackPageview', data.config.url]);

            EAJS.log('HMT', data);


        }
    }


    var dataList = m.getInput('send');
    for (var i in dataList) {
        m.baidu.send(dataList[i]);
    }

    // Process pageviews after new are added
    document.addEventListener('eventAddedToJackWolfQueue', function (e) {
        m.baidu.send(e.detail);
    });

})(EAJS, location, navigator, document)





