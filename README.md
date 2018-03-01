```


    var _ea = _ea || {};

    _ea.config = {
        accounts: {
            'piwik': '3',
            'google': 'UA-91960108-1'
        }
    };

    _ea.user = {
        "uid": "3",         // 用户ID

    };

    _ea.pageType = 'others' //页面类型


    _ea.products = {  //产品展示

        items:[
            {
                    sku:'', // String
                    title:'', // String
                    category:[], // Array
            }
        ]

    }

    _ea.product = { //产品详情
          sku:'', // String
          title:'', // String
          category:['衣服','长袖'], // Array

    }


    _ea.cart = {  //购物车操作

        action:'add to cart', //购物车操作  (add to cart  ||  remove from cart)
        product:{
           sku:'', // String
           title:'', // String
           category:['衣服','长袖'], // Array,
           quantity:'' // String
        }
    }


    _ea.checkout = {   //购买流程
        items:[
            {
                 sku:'', // String
                 title:'', // String
                 category:['衣服','长袖'], // Array,
                 quantity:'' // String
            }
        ],
        step:'1'  // ('1' : 查看购物车,'2' : 结算,'3' : 去支付)  must be string
    }


    _ea.order = {    //交易完成

        items:[
            {
                sku:'', // String
                 title:'', // String
                 category:['衣服','长袖'], // Array,
                 quantity:'', // String
                 price:''
            }
        ],
        payType:'alipay'  //('alipay' || 'wechatpay'),
        orderId:'', // 订单Id
        groundTotal:'',  //总收入
        tax:'',//总税
        shipping:''
    }


    _ea.click = {
        product:{ //产品点击
              sku:'', // String
              title:'', // String
              category:['衣服','长袖'], // Array,
              quantity:'', // String
              position:''
        }
    }

    _ea.event = { //自定义事件

        category:'',
        action:'',
        label:'',
        value:'',
    }
     //用于GA发送事件
    // ga('send', 'event',event.category,event.action,event.label,event.value);

    (function(w,d,t,u,n,a,m){w['JackWolfTrackingObject']=n;
        w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
                m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
    })(window,document,'script','./ea.min.js','ea');

    ea('send',_ea)
```