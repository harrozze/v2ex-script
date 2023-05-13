// ==UserScript==
// @name         V2EX - 超级增强
// @namespace    http://tampermonkey.net/
// @version      3.3.8
// @description  楼中楼回复(支持感谢数排序)、自动签到、使用 SOV2EX 搜索、列表预览内容、点击帖子弹框展示详情、对用户打标签、正文超长自动折叠、划词 base64 解码、一键@所有人,@管理员、操作按钮(感谢、收藏、回复、隐藏)异步请求、支持黑暗模式
// @author       Zyronon
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @match        https://*.v2ex.com/go/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.runtime.global.prod.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @license      GPL License
// ==/UserScript==

(function () {



  let style = `
html,body{font-size:62.5%}.flex{display:flex;align-items:center;justify-content:space-between}.flex-end{justify-content:flex-end}.flex-center{justify-content:center}.p1{padding:1rem}.p0{padding:0!important}.post-author{display:flex;align-items:center;position:relative;color:#ccc!important}.post-author>.username{font-size:1.2rem}.sticky{position:sticky;bottom:0}.sticky[stuck]{box-shadow:0 2px 20px #00000059}a{color:#778087;text-decoration:none;cursor:pointer}a:hover{text-decoration:underline}.base-loading{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear}.loading-c{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;width:3rem;height:3rem}.loading-b{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;border-color:#ffffff rgba(178,177,177,.2) rgba(178,177,177,.2) rgba(178,177,177,.2);width:3rem;height:3rem}@keyframes circle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.button{cursor:pointer;padding:.4rem 2.4rem;border-radius:5px;display:inline-flex;justify-content:center;align-items:center;font-weight:700;font-size:1.2rem;color:#fff;background:#40a9ff;border:1px solid #40a9ff;user-select:none}.button.info{color:#000;border:1px solid #40a9ff;background:white}.button.gray{color:#fff;border:1px solid #b6b6b6;background:#b6b6b6}.button:hover{opacity:.9}.button:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;border-color:#fff transparent transparent transparent;width:1rem;height:1rem;margin-right:1rem;display:none}.button.loading{cursor:not-allowed;opacity:.5}.button.loading:before{display:block}.button.disabled{cursor:not-allowed;color:#c6c6c6;background:#8d8d8d;border:1px solid transparent}.tool{position:relative;margin-left:.6rem;display:flex;align-items:center;font-size:1.2rem;font-weight:700;border-radius:.2rem;cursor:pointer;height:3rem;padding:0 .5rem}.tool:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle infinite 1s linear;border-color:transparent #929596 #929596 #929596;width:1rem;height:1rem;margin-left:1rem;display:none}.tool.loading{cursor:not-allowed;opacity:.5}.tool.loading:before{display:block}.tool.loading:hover{background:unset}.tool>svg{width:1.6rem!important;height:1.6rem!important;margin-right:.4rem;box-sizing:border-box;border-radius:.2rem}.tool:hover{background:#e8e8e8}.tool.no-hover{cursor:default}.tool.no-hover:hover{background:unset}.my-node{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node:hover{text-decoration:none;background:#e2e2e2}.msgs{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.msg{cursor:default;margin-bottom:2rem;background:white;display:flex;color:#000;font-size:1.4rem;box-sizing:border-box;border-radius:.4rem;box-shadow:0 0 1rem 1px silver}.msg.success .left{background:#40a9ff}.msg.warning .left{background:#c8c002}.msg.error .left{background:red}.msg .left{border-radius:.4rem 0 0 .4rem;display:flex;align-items:center;background:#40a9ff}.msg .left svg{margin:0 .3rem;cursor:pointer}.msg .right{flex:1;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.line{border-bottom:1px solid #e2e2e2}.my-box{box-shadow:0 2px 3px #0000001a;border-radius:.4rem;background:white;margin-bottom:2rem;width:100%;box-sizing:border-box}.my-cell{padding:1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid #e2e2e2}.f14{font-size:1.4rem}.switch{width:4.5rem;height:2rem;border-radius:2rem;position:relative;display:flex;align-items:center;border:1px solid #ccc;transition:all .3s}.switch.active{background:#ccc}.switch.active:before{right:.2rem;background:white}.switch:before{position:absolute;content:" ";transition:all .3s;right:calc(100% - 2rem);width:1.8rem;height:1.8rem;border-radius:50%;background:#ccc}.modal{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option{display:flex;justify-content:space-between;align-items:center;padding:.8rem 0}.modal .mask{position:fixed;width:100vw;height:100vh;left:0;top:0;background:rgba(0,0,0,.3)}.radio-group2{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid #e2e2e2}.radio-group2 .radio{cursor:pointer;background:transparent;padding:.4rem 1rem;border-left:1px solid #e2e2e2;color:#9ca1a4;font-size:1.2rem}.radio-group2 .radio:first-child{border-left:none}.radio-group2 .active{background:#e2e2e2;color:gray}.horizontal[data-v-721ac04c]{flex-direction:row!important;padding:0!important}.horizontal .num[data-v-721ac04c]{margin-left:.2rem}.point[data-v-721ac04c]{font-size:1.2rem;padding:1rem 0;min-width:4rem;border-radius:.4rem 0 0 .4rem;display:flex;flex-direction:column;align-items:center}.point .up[data-v-721ac04c]{display:flex;flex-direction:column;align-items:center;justify-content:center}.point .num[data-v-721ac04c]{font-weight:700;color:#000;user-select:none}.point svg[data-v-721ac04c]{width:2rem;padding:.4rem;border-radius:.2rem}.point svg[data-v-721ac04c]:hover{background:#e5e5e5}.point .disabled[data-v-721ac04c]:hover{background:unset}.Author[data-v-65ce6e06]{display:flex;align-items:center;justify-content:space-between;font-size:1.2rem;position:relative;margin-bottom:.4rem}.Author.expand[data-v-65ce6e06]{margin-bottom:0}.Author .Author-left[data-v-65ce6e06]{display:flex;align-items:center;max-width:90%}.Author .Author-left .username[data-v-65ce6e06]{font-size:1.4rem;margin-right:1rem}.Author .Author-left .expand-icon[data-v-65ce6e06]{cursor:pointer;margin-right:.8rem;width:2rem;height:2rem;transform:rotate(90deg)}.Author .Author-left .icon[data-v-65ce6e06]{margin-right:1rem;display:flex}.Author .Author-left .icon img[data-v-65ce6e06]{width:3.4rem;height:3.4rem;border-radius:.3rem}.Author .Author-left .texts[data-v-65ce6e06]{flex:1}.Author .Author-left .op[data-v-65ce6e06]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.Author .Author-left .mod[data-v-65ce6e06]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.Author .Author-left .my-tag[data-v-65ce6e06]{font-size:1.3rem;font-weight:700;color:red;margin-left:1rem}.Author .Author-left .my-tag:hover .remove[data-v-65ce6e06]{display:inline}.Author .Author-left .my-tag .remove[data-v-65ce6e06]{cursor:pointer;margin-left:.5rem;display:none}.Author .Author-left .add-tag[data-v-65ce6e06]{font-size:2rem;line-height:1rem;display:inline-block;margin-left:1rem;cursor:pointer;display:none}.Author:hover .add-tag[data-v-65ce6e06]{display:inline-block}.Author .Author-right[data-v-65ce6e06]{position:absolute;right:0;display:flex;align-items:center}.Author .Author-right .toolbar[data-v-65ce6e06]{display:flex;align-items:center;color:#929596;opacity:0}.Author .Author-right .toolbar[data-v-65ce6e06]:hover{background:white;opacity:1}.Author .Author-right .floor[data-v-65ce6e06]{margin-left:1rem;font-size:1.2rem;line-height:1rem;border-radius:1rem;display:inline-block;background-color:#f0f0f0;color:#ccc;padding:.2rem .5rem;cursor:default}.Author .Author-right .isDev[data-v-65ce6e06]{color:#000!important}.post-editor-wrapper[data-v-0048db38]{width:100%;box-sizing:border-box;position:relative;overflow:hidden;transition:all .3s}.post-editor-wrapper.reply-post .post-editor[data-v-0048db38]{border:1px solid #e2e2e2;border-radius:.4rem}.post-editor-wrapper.reply-post.isFocus .post-editor[data-v-0048db38]{border:1px solid #968b8b}.post-editor-wrapper.reply-comment[data-v-0048db38]{border:1px solid #e2e2e2;border-radius:.4rem;overflow:hidden}.post-editor-wrapper.reply-comment.isFocus[data-v-0048db38]{border:1px solid #968b8b}.post-editor-wrapper.reply-comment .toolbar[data-v-0048db38]{background:#f6f7f8}.post-editor-wrapper .post-editor[data-v-0048db38]{transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;border:none;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.4rem;min-height:13rem;resize:none}.post-editor-wrapper .toolbar[data-v-0048db38]{box-sizing:border-box;padding:.5rem 1rem;width:100%;position:relative;display:flex;justify-content:space-between;align-items:center}.post-editor-wrapper .toolbar span[data-v-0048db38]{color:gray;font-size:1.3rem}.post-editor-wrapper .get-cursor[data-v-0048db38]{transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;border:none;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.4rem;min-height:13rem;resize:none;position:absolute;top:0;z-index:-100}html[data-v-6959f800],body[data-v-6959f800]{font-size:62.5%}.flex[data-v-6959f800]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-6959f800]{justify-content:flex-end}.flex-center[data-v-6959f800]{justify-content:center}.p1[data-v-6959f800]{padding:1rem}.p0[data-v-6959f800]{padding:0!important}.post-author[data-v-6959f800]{display:flex;align-items:center;position:relative;color:#ccc!important}.post-author>.username[data-v-6959f800]{font-size:1.2rem}.sticky[data-v-6959f800]{position:sticky;bottom:0}.sticky[stuck][data-v-6959f800]{box-shadow:0 2px 20px #00000059}a[data-v-6959f800]{color:#778087;text-decoration:none;cursor:pointer}a[data-v-6959f800]:hover{text-decoration:underline}.base-loading[data-v-6959f800]{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-6959f800 infinite 1s linear}.loading-c[data-v-6959f800]{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-6959f800 infinite 1s linear;width:3rem;height:3rem}.loading-b[data-v-6959f800]{border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-6959f800 infinite 1s linear;border-color:#ffffff rgba(178,177,177,.2) rgba(178,177,177,.2) rgba(178,177,177,.2);width:3rem;height:3rem}@keyframes circle-6959f800{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.button[data-v-6959f800]{cursor:pointer;padding:.4rem 2.4rem;border-radius:5px;display:inline-flex;justify-content:center;align-items:center;font-weight:700;font-size:1.2rem;color:#fff;background:#40a9ff;border:1px solid #40a9ff;user-select:none}.button.info[data-v-6959f800]{color:#000;border:1px solid #40a9ff;background:white}.button.gray[data-v-6959f800]{color:#fff;border:1px solid #b6b6b6;background:#b6b6b6}.button[data-v-6959f800]:hover{opacity:.9}.button[data-v-6959f800]:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-6959f800 infinite 1s linear;border-color:#fff transparent transparent transparent;width:1rem;height:1rem;margin-right:1rem;display:none}.button.loading[data-v-6959f800]{cursor:not-allowed;opacity:.5}.button.loading[data-v-6959f800]:before{display:block}.button.disabled[data-v-6959f800]{cursor:not-allowed;color:#c6c6c6;background:#8d8d8d;border:1px solid transparent}.tool[data-v-6959f800]{position:relative;margin-left:.6rem;display:flex;align-items:center;font-size:1.2rem;font-weight:700;border-radius:.2rem;cursor:pointer;height:3rem;padding:0 .5rem}.tool[data-v-6959f800]:before{content:" ";border:2px solid;border-color:#000 #00000033 #00000033 #00000033;border-radius:100%;animation:circle-6959f800 infinite 1s linear;border-color:transparent #929596 #929596 #929596;width:1rem;height:1rem;margin-left:1rem;display:none}.tool.loading[data-v-6959f800]{cursor:not-allowed;opacity:.5}.tool.loading[data-v-6959f800]:before{display:block}.tool.loading[data-v-6959f800]:hover{background:unset}.tool>svg[data-v-6959f800]{width:1.6rem!important;height:1.6rem!important;margin-right:.4rem;box-sizing:border-box;border-radius:.2rem}.tool[data-v-6959f800]:hover{background:#e8e8e8}.tool.no-hover[data-v-6959f800]{cursor:default}.tool.no-hover[data-v-6959f800]:hover{background:unset}.my-node[data-v-6959f800]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node[data-v-6959f800]:hover{text-decoration:none;background:#e2e2e2}.msgs[data-v-6959f800]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.msg[data-v-6959f800]{cursor:default;margin-bottom:2rem;background:white;display:flex;color:#000;font-size:1.4rem;box-sizing:border-box;border-radius:.4rem;box-shadow:0 0 1rem 1px silver}.msg.success .left[data-v-6959f800]{background:#40a9ff}.msg.warning .left[data-v-6959f800]{background:#c8c002}.msg.error .left[data-v-6959f800]{background:red}.msg .left[data-v-6959f800]{border-radius:.4rem 0 0 .4rem;display:flex;align-items:center;background:#40a9ff}.msg .left svg[data-v-6959f800]{margin:0 .3rem;cursor:pointer}.msg .right[data-v-6959f800]{flex:1;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.line[data-v-6959f800]{border-bottom:1px solid #e2e2e2}.my-box[data-v-6959f800]{box-shadow:0 2px 3px #0000001a;border-radius:.4rem;background:white;margin-bottom:2rem;width:100%;box-sizing:border-box}.my-cell[data-v-6959f800]{padding:1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid #e2e2e2}.f14[data-v-6959f800]{font-size:1.4rem}.switch[data-v-6959f800]{width:4.5rem;height:2rem;border-radius:2rem;position:relative;display:flex;align-items:center;border:1px solid #ccc;transition:all .3s}.switch.active[data-v-6959f800]{background:#ccc}.switch.active[data-v-6959f800]:before{right:.2rem;background:white}.switch[data-v-6959f800]:before{position:absolute;content:" ";transition:all .3s;right:calc(100% - 2rem);width:1.8rem;height:1.8rem;border-radius:50%;background:#ccc}.modal[data-v-6959f800]{position:fixed;z-index:100;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-6959f800]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-6959f800]{display:flex;justify-content:space-between;align-items:center;padding:.8rem 0}.modal .mask[data-v-6959f800]{position:fixed;width:100vw;height:100vh;left:0;top:0;background:rgba(0,0,0,.3)}.radio-group2[data-v-6959f800]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid #e2e2e2}.radio-group2 .radio[data-v-6959f800]{cursor:pointer;background:transparent;padding:.4rem 1rem;border-left:1px solid #e2e2e2;color:#9ca1a4;font-size:1.2rem}.radio-group2 .radio[data-v-6959f800]:first-child{border-left:none}.radio-group2 .active[data-v-6959f800]{background:#e2e2e2;color:gray}.html-wrapper[data-v-6959f800]{position:relative}.html-wrapper .mask[data-v-6959f800]{max-height:90rem;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent)}.html-wrapper .expand[data-v-6959f800]{position:absolute;z-index:1;bottom:2rem;padding:.2rem 1.5rem;border-radius:2rem;border:1px solid gray;background:white;color:gray;left:50%;transform:translate(-50%);cursor:pointer}.comment[data-v-55446f68]{width:100%;box-sizing:border-box;margin-top:1rem;background:white}.comment .comment-content-w[data-v-55446f68]{background:white}.comment .comment-content-w .more[data-v-55446f68]{text-align:center;margin:2rem 0}.comment .comment-content[data-v-55446f68]{display:flex;position:relative}.comment .comment-content .expand-line[data-v-55446f68]{cursor:pointer;width:3rem;min-width:3rem;position:relative}.comment .comment-content .expand-line[data-v-55446f68]:after{position:absolute;left:calc(60% - 1px);content:" ";height:100%;width:0;border-right:1px solid #f1f1f1}.comment .comment-content .expand-line[data-v-55446f68]:hover:after{border-right:2px solid #0079D3}.comment .comment-content .right[data-v-55446f68]{flex:1;width:calc(100% - 3rem)}.comment .comment-content .right .w[data-v-55446f68]{padding-left:1.7rem}.comment .comment-content .right .w .text[data-v-55446f68]{color:#000;word-break:break-word}.comment .comment-content .right .w .warning[data-v-55446f68]{border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;padding:1rem 0;margin-top:1rem;font-size:1.2rem;color:red}.comment .comment-content .right .w .post-editor-wrapper[data-v-55446f68]{margin-top:1rem}.toolbar[data-v-25defeac]{display:flex;align-items:center;color:#929596}.sticky{position:sticky;bottom:-2px;z-index:2}.sticky[stuck]{box-shadow:0 2px 20px #00000059!important}.post[data-v-7d619111]{position:unset!important;background:transparent!important;overflow:unset!important}.post .main[data-v-7d619111]{background:transparent!important;padding:unset!important;width:100%!important}.post .close-btn[data-v-7d619111]{display:none}.post-detail[data-v-7d619111]{text-align:start;position:fixed;z-index:99;left:0;right:0;bottom:0;top:0;background:rgba(46,47,48,.8);overflow:auto;font-size:1.4rem;display:flex;justify-content:center;flex-wrap:wrap}.post-detail.isNight[data-v-7d619111]{background:rgba(46,47,48,.8)}.post-detail.isNight .main[data-v-7d619111]{background:#22303f}.post-detail.isNight .main .toolbar-wrapper[data-v-7d619111]{border-top:unset!important}.post-detail.isNight .main .button.gray[data-v-7d619111]{background:#18222d!important;border:1px solid #18222d!important}.post-detail.isNight .main .my-box[data-v-7d619111]{color:#fff;background:#18222d}.post-detail.isNight .main .my-box .title[data-v-7d619111],.post-detail.isNight .main .my-box .content[data-v-7d619111]{color:#d1d5d9!important}.post-detail.isNight .main .my-box .base-info[data-v-7d619111],.post-detail.isNight .main .my-box .content[data-v-7d619111]{border:1px solid #22303f!important}.post-detail.isNight .main[data-v-7d619111] .subtle .fade{color:#b2c3d4!important}.post-detail.isNight .main[data-v-7d619111] .subtle .topic_content{color:#d1d5d9!important}.post-detail.isNight .main .my-cell[data-v-7d619111]{border-bottom:1px solid #22303f!important}.post-detail.isNight .main[data-v-7d619111] .comment{background:#18222d}.post-detail.isNight .main[data-v-7d619111] .comment .expand-line:after{border-right:1px solid #202c39!important}.post-detail.isNight .main[data-v-7d619111] .comment .expand-line:hover:after{border-right:2px solid #0079D3!important}.post-detail.isNight .main[data-v-7d619111] .comment .comment-content{background:#18222d!important}.post-detail.isNight .main[data-v-7d619111] .comment .comment-content .w>.text{color:#d1d5d9!important}.post-detail.isNight .main[data-v-7d619111] .Author-right .toolbar:hover{background:#18222d!important}.post-detail.isNight .main[data-v-7d619111] .Author-right .tool{background:#22303f!important}.post-detail.isNight .main[data-v-7d619111] .point{margin-left:.5rem}.post-detail.isNight .main[data-v-7d619111] .point svg:hover{background:#22303f}.post-detail.isNight .main[data-v-7d619111] .point .num{color:#d1d5d9!important}.post-detail.isNight .main[data-v-7d619111] .floor{background:#393f4e!important;color:#d1d5d9!important}.post-detail.isNight .main .editor-wrapper[data-v-7d619111]{background:#393f4e!important}.post-detail.isNight .main[data-v-7d619111] .post-editor-wrapper .post-editor{background:#18222d;border:transparent;color:#fff}.post-detail.isNight .main[data-v-7d619111] .post-editor-wrapper .toolbar{background:#393f4e!important}.post-detail.isNight .main .call-list[data-v-7d619111]{background:#22303f}.post-detail.isNight .main .call-list .call-item[data-v-7d619111]{border-top:1px solid #18222d}.post-detail.isNight .main .call-list .call-item .select[data-v-7d619111],.post-detail.isNight .main .call-list .call-item[data-v-7d619111]:hover,.post-detail.isNight .main .call-list .call-item.select[data-v-7d619111]{background-color:#393f4e;text-decoration:none}.post-detail .main[data-v-7d619111]{display:flex;justify-content:flex-end;padding:3rem 8rem 15rem;background:#e2e2e2;position:relative}.post-detail .main .main-wrapper[data-v-7d619111]{width:77rem;padding-bottom:2rem;display:flex;flex-direction:column;align-items:center}.post-detail .main .main-wrapper .post-wrapper .toolbar-wrapper[data-v-7d619111]{border-top:1px solid #e2e2e2;height:4rem;padding-left:.6rem;display:flex;align-items:center}.post-detail .main .main-wrapper .editor-wrapper .float[data-v-7d619111]{margin-right:2rem}.post-detail .main .main-wrapper .editor-wrapper .w[data-v-7d619111]{padding:1.2rem}.post-detail .main .main-wrapper .comment-wrapper .comments[data-v-7d619111]{width:100%;box-sizing:border-box}.post-detail .main .main-wrapper .loading-wrapper[data-v-7d619111]{height:20rem;display:flex;justify-content:center;align-items:center}.post-detail .main .main-wrapper #no-comments-yet[data-v-7d619111]{color:#a9a9a9;font-weight:700;text-align:center;width:100%;margin-bottom:2rem;box-sizing:border-box}.post-detail .main .call-list[data-v-7d619111]{z-index:9;position:absolute;top:12rem;border:1px solid #ccc;background-color:#fff;box-shadow:0 5px 15px #0000001a;overflow:hidden;max-height:30rem;min-width:8rem;box-sizing:content-box}.post-detail .main .call-list .call-item[data-v-7d619111]{border-top:1px solid #ccc;height:3rem;display:flex;padding:0 1rem;align-items:center;cursor:pointer;font-size:14px;box-sizing:border-box}.post-detail .main .call-list .call-item .select[data-v-7d619111],.post-detail .main .call-list .call-item[data-v-7d619111]:hover,.post-detail .main .call-list .call-item.select[data-v-7d619111]{background-color:#f0f0f0;text-decoration:none}.post-detail .main .call-list .call-item[data-v-7d619111]:nth-child(1){border-top:1px solid transparent}@media screen and (max-width: 1500px){.post-detail .main-wrapper[data-v-7d619111]{width:65vw!important}}@media screen and (max-width: 1280px){.post-detail .main-wrapper[data-v-7d619111]{width:75vw!important}}.post-detail .scroll-top[data-v-7d619111]{position:fixed;bottom:3rem;z-index:99;padding:.4rem 1.4rem;transform:translate(6rem)}.post-detail .close-btn[data-v-7d619111]{color:#b6b6b6;cursor:pointer;position:fixed;top:3rem;transform:translate(4rem);font-size:2rem}p:first-child{margin-top:0}p:last-child{margin-bottom:0}.post[data-v-71df4ceb]{font-size:1.4rem;background:white;text-align:start;padding:1rem;overflow:hidden}.post.isNight[data-v-71df4ceb]{background:#18222d;border:none!important}.post.isNight .title a[data-v-71df4ceb]{color:#a9bcd6!important}.post.isNight .bottom .date[data-v-71df4ceb]{color:#738292}.post.isNight .post-content-wrapper[data-v-71df4ceb]{color:#d1d5d9!important}.post.isNight .my-node[data-v-71df4ceb]{background:#393f4e;color:#9caec7}.post.isNight .my-node[data-v-71df4ceb]:hover{background:#9caec7;color:#001d25}.post.isNight .count[data-v-71df4ceb]{background:#393f4e!important;color:#d1d5d9!important}.post.isNight.visited .count[data-v-71df4ceb]{background:#001d25!important;color:#393f4e!important}.post.isNight.visited .title a[data-v-71df4ceb]{color:#393f4e!important}.post.isNight.visited .post-content-wrapper[data-v-71df4ceb]{color:#576077!important}.post.table[data-v-71df4ceb]{border-bottom:1px solid #e2e2e2}.post.table .post-content-wrapper[data-v-71df4ceb]{display:none}.post.table .title a[data-v-71df4ceb]{color:#778087;font-size:1.6rem}.post.card[data-v-71df4ceb]{margin-top:1.1rem;border:1px solid #e2e2e2;border-radius:.4rem;cursor:pointer}.post.card[data-v-71df4ceb]:hover{border:1px solid #968b8b}.post.card .title a[data-v-71df4ceb]{color:#000;font-size:1.8rem}.post.visited .title a[data-v-71df4ceb]{color:#afb9c1!important}.post.visited .post-content-wrapper[data-v-71df4ceb]{opacity:.6}.post .base-info[data-v-71df4ceb]{box-sizing:border-box;display:flex;justify-content:space-between;align-items:flex-start}.post .base-info .left[data-v-71df4ceb]{display:flex;width:95%}.post .base-info .left .avatar[data-v-71df4ceb]{margin-right:1rem}.post .base-info .left .avatar img[data-v-71df4ceb]{border-radius:.4rem;width:4.8rem;min-width:4.8rem;min-height:4.8rem}.post .base-info .left .right[data-v-71df4ceb]{display:flex;flex-direction:column;justify-content:space-between}.post .base-info .left .right .title[data-v-71df4ceb]{display:inline;align-items:center}.post .base-info .left .right .bottom[data-v-71df4ceb]{font-size:1.2rem;line-height:1.2rem;display:flex;align-items:center;color:#ccc}.post .base-info .count[data-v-71df4ceb]{margin-top:1.8rem;line-height:12px;font-weight:700;color:#fff;background-color:#aab0c6;display:inline-block;padding:2px 10px;-moz-border-radius:12px;-webkit-border-radius:12px;border-radius:12px;text-decoration:none;cursor:pointer}.post .base-info .count[data-v-71df4ceb]:hover{background-color:#969cb1}.post .post-content-wrapper[data-v-71df4ceb]{max-height:20rem;overflow:hidden;margin-top:.6rem;color:#000;position:relative;line-break:anywhere;font-size:1.4rem}.post .post-content-wrapper.mask[data-v-71df4ceb]{-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent)}.base64_tooltip[data-v-61690a22]{box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;background:white;min-height:2.2rem;max-width:20rem;padding:.8rem;position:fixed;z-index:9998;display:flex;align-items:center;border-radius:.5rem;cursor:pointer;line-break:anywhere}.base64_tooltip svg[data-v-61690a22]{margin-left:1rem;min-width:1.8rem}.base64_tooltip .button[data-v-61690a22]{margin-top:1rem;margin-left:2rem}.isNight{background:#22303f}.isNight .open-post,.isNight .nav{color:#fff;background:#18222d;border:none}.isNight .setting-modal .wrapper{background:#22303f}.isNight .setting-modal .wrapper .option{color:#000}.isNight .setting-modal .wrapper .option span{color:gray!important}.isNight .tag-modal .wrapper{background:#22303f}.isNight .tag-modal .wrapper .option{color:#fff}.isNight .tag-modal .wrapper .option span{color:gray!important}.isNight .radio-group2{border:1px solid #454847}.isNight .radio-group2 .radio{border-left:1px solid #454847;color:#fff}.isNight .radio-group2 .active{background:#165c94}.isNight .base64_tooltip{background:#22303f}.app-home{position:relative}.app-home.home,.app-home.recent,.app-home.nodePage{background:#e2e2e2}.page.card{margin-top:1rem}.nav{font-size:1.4rem;background:white;text-align:start;padding:1rem;border:1px solid #e2e2e2}.nav .nav-item{cursor:pointer;display:flex;margin-right:2rem;padding:.6rem;border-radius:.4rem;color:#778087}.nav .nav-item.active{background:#40a9ff;color:#fff}.nav .nav-item.active:hover{background:#40a9ff;opacity:.8}.nav .nav-item:hover{background:#e2e2e2}.nav .nav-item span{margin-left:.4rem}.setting-modal .wrapper{z-index:9;background:#f1f1f1;border-radius:.8rem;font-size:1.4rem;padding:2rem 6rem 4rem;width:45rem}.setting-modal .wrapper .sub-title{color:gray;font-size:1.4rem;margin-bottom:4rem}.setting-modal .wrapper .notice{font-size:12px;display:flex;flex-direction:column;justify-content:flex-start;padding-left:3rem;line-break:anywhere;text-align:left}.setting-modal .wrapper .jieshao{margin-top:2rem;font-size:15px;font-weight:700;color:red;display:flex;justify-content:flex-start;line-break:anywhere;text-align:left}.tag-modal .wrapper{z-index:9;background:#f1f1f1;border-radius:.8rem;font-size:1.4rem;padding:2rem 6rem 4rem;width:25rem}.tag-modal .wrapper input{margin-bottom:3rem;width:100%;height:3rem;outline:unset;border:1px solid #e1e1e1;padding:0 .5rem;border-radius:5px;box-sizing:border-box}.tag-modal .wrapper .btns{display:flex;justify-content:flex-end;gap:1rem}


    `
  let addStyle = document.createElement ("style");
  addStyle.rel = "stylesheet";
  addStyle.type = "text/css";
  addStyle.innerHTML = style
  document.head.append (addStyle)

  setTimeout(function(){

    (function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const u of n.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}})();const r={eventMap:new Map,on(t,e){let s=this.eventMap.get(t);s?s.push(e):s=[e],this.eventMap.set(t,s)},emit(t,e){let s=this.eventMap.get(t);s&&s.map(i=>i(e))},off(t){this.eventMap.has(t)&&this.eventMap.delete(t)},clear(){this.eventMap=new Map}},a={SHOW_TOOLTIP:"SHOW_TOOLTIP",SHOW_MSG:"SHOW_MSG",SET_CALL:"SET_CALL",SHOW_CALL:"SHOW_CALL",REFRESH_ONCE:"REFRESH_ONCE",ADD_REPLY:"ADD_REPLY",IGNORE:"IGNORE",MERGE:"MERGE",REMOVE:"REMOVE",CHANGE_COMMENT_THANK:"CHANGE_COMMENT_THANK",CHANGE_POST_THANK:"CHANGE_POST_THANK",ADD_TAG:"ADD_TAG",REMOVE_TAG:"REMOVE_TAG"};const k=(t,e)=>{const s=t.__vccOpts||t;for(const[i,o]of e)s[i]=o;return s},q={name:"Point",inject:["post","isLogin"],props:{item:{type:Object,default(){return{}}},type:{type:String,default(){return"horizontal"}},apiUrl:""},computed:{disabled(){return this.item.username===window.user.username||this.item.isThanked}},methods:{getColor(t){return t?"#ff4500":"#929596"},getIsFull(t){return t?"#ff4500":"none"},async thank(){if(!this.isLogin)return r.emit(a.SHOW_MSG,{type:"warning",text:"请先登录！"});if(this.item.username===window.user.username)return r.emit(a.SHOW_MSG,{type:"warning",text:"不能感谢自己"});if(this.item.isThanked)return r.emit(a.SHOW_MSG,{type:"warning",text:"已经感谢过了"});if(confirm(`确认花费 10 个铜币向 @${this.item.username} 的这条回复发送感谢？`)){this.$emit("addThank");let t=`${window.baseUrl}/thank/${this.apiUrl}?once=${this.post.once}`;$.post(t).then(e=>{console.log("感谢",e),e.success||(this.$emit("recallThank"),r.emit(a.SHOW_MSG,{type:"error",text:e.message})),r.emit(a.REFRESH_ONCE,e.once)},e=>{this.$emit("recallThank"),r.emit(a.SHOW_MSG,{type:"error",text:"感谢失败"}),r.emit(a.REFRESH_ONCE)})}}}},X=["fill","stroke"],Y={class:"num"};function J(t,e,s,i,o,n){return Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["point",s.type])},[Vue.createElementVNode("div",{class:"up",onClick:e[0]||(e[0]=Vue.withModifiers((...u)=>n.thank&&n.thank(...u),["stop"]))},[(Vue.openBlock(),Vue.createElementBlock("svg",{class:Vue.normalizeClass({disabled:n.disabled}),width:"19",height:"19",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[Vue.createElementVNode("path",{d:"M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z",fill:n.getIsFull(s.item.isThanked),stroke:n.getColor(s.item.isThanked),"stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},null,8,X)],2))]),Vue.createElementVNode("div",Y,Vue.toDisplayString(s.item.thankCount?s.item.thankCount:"感谢"),1)],2)}const b=k(q,[["render",J],["__scopeId","data-v-721ac04c"]]);const Q={name:"Author",components:{Point:b},inject:["isDev","isLogin","tags","config"],props:{modelValue:!1,comment:{type:Object,default(){return{}}}},computed:{pointInfo(){return{isThanked:this.comment.isThanked,thankCount:this.comment.thankCount,username:this.comment.username}},myTags(){return this.tags[this.comment.username]??[]}},methods:{addTag(){r.emit(a.ADD_TAG,this.comment.username)},removeTag(t){r.emit(a.REMOVE_TAG,{username:this.comment.username,tag:t})},checkIsLogin(t=""){return this.isLogin?(this.$emit(t),!0):(r.emit(a.SHOW_MSG,{type:"warning",text:"请先登录！"}),!1)},addThank(){r.emit(a.CHANGE_COMMENT_THANK,{id:this.comment.id,type:"add"})},recallThank(){r.emit(a.CHANGE_COMMENT_THANK,{id:this.comment.id,type:"recall"})}}},T=t=>(Vue.pushScopeId("data-v-65ce6e06"),t=t(),Vue.popScopeId(),t),ee={class:"Author-left"},te=T(()=>Vue.createElementVNode("path",{d:"M22 42H6V26",stroke:"#177EC9","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"},null,-1)),oe=T(()=>Vue.createElementVNode("path",{d:"M26 6H42V22",stroke:"#177EC9","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"},null,-1)),ne=[te,oe],se=["href"],le=["src"],ie={class:"texts"},re=["href"],ae={key:0,class:"op"},ce={key:1,class:"mod"},ue={class:"ago"},de={class:"my-tag"},me=T(()=>Vue.createElementVNode("i",{class:"fa fa-tag"},null,-1)),pe=["onClick"],Ve={class:"Author-right"},he={class:"toolbar"},fe=Vue.createStaticVNode('<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-65ce6e06><path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-65ce6e06></path><path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-65ce6e06></path><path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-65ce6e06></path><path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-65ce6e06></path></svg><span data-v-65ce6e06>回复</span>',2),ge=[fe],ve=T(()=>Vue.createElementVNode("span",null,"隐藏",-1)),_e=[ve];function we(t,e,s,i,o,n){const u=Vue.resolveComponent("Point");return Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["Author",{expand:!s.modelValue}])},[Vue.createElementVNode("div",ee,[s.modelValue?Vue.createCommentVNode("",!0):(Vue.openBlock(),Vue.createElementBlock("svg",{key:0,class:"expand-icon",onClick:e[0]||(e[0]=p=>t.$emit("update:modelValue",!0)),width:"24",height:"24",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},ne)),Vue.createElementVNode("a",{class:"icon",href:`/member/${s.comment.username}`},[Vue.createElementVNode("img",{src:s.comment.avatar,alt:""},null,8,le)],8,se),Vue.createElementVNode("span",ie,[Vue.createElementVNode("strong",null,[Vue.createElementVNode("a",{href:`/member/${s.comment.username}`,class:"username"},Vue.toDisplayString(s.comment.username),9,re)]),s.comment.isOp?(Vue.openBlock(),Vue.createElementBlock("div",ae,"OP")):Vue.createCommentVNode("",!0),s.comment.isMod?(Vue.openBlock(),Vue.createElementBlock("div",ce,"MOD")):Vue.createCommentVNode("",!0),Vue.createElementVNode("span",ue,Vue.toDisplayString(s.comment.date),1),n.isLogin&&n.config.openTag?(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,{key:2},[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(n.myTags,p=>(Vue.openBlock(),Vue.createElementBlock("span",de,[me,Vue.createElementVNode("span",null,Vue.toDisplayString(p),1),Vue.createElementVNode("i",{class:"fa fa-trash-o remove",onClick:V=>n.removeTag(p)},null,8,pe)]))),256)),Vue.createElementVNode("span",{class:"add-tag ago",onClick:e[1]||(e[1]=(...p)=>n.addTag&&n.addTag(...p)),title:"添加标签"},"+")],64)):Vue.createCommentVNode("",!0)])]),Vue.createElementVNode("div",Ve,[Vue.createElementVNode("div",he,[Vue.createElementVNode("div",{class:"tool",onClick:e[2]||(e[2]=p=>n.checkIsLogin("reply"))},ge),Vue.createElementVNode("div",{class:"tool",onClick:e[3]||(e[3]=p=>n.checkIsLogin("hide"))},_e),s.comment.thankCount?Vue.createCommentVNode("",!0):(Vue.openBlock(),Vue.createBlock(u,{key:0,item:n.pointInfo,onAddThank:n.addThank,onRecallThank:n.recallThank,"api-url":"reply/"+s.comment.id},null,8,["item","onAddThank","onRecallThank","api-url"]))]),s.comment.thankCount?(Vue.openBlock(),Vue.createBlock(u,{key:0,item:n.pointInfo,onAddThank:n.addThank,onRecallThank:n.recallThank,"api-url":"reply/"+s.comment.id},null,8,["item","onAddThank","onRecallThank","api-url"])):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",{class:Vue.normalizeClass(["floor",{isDev:n.isDev}])},Vue.toDisplayString((n.isDev?"a":"")+s.comment.floor),3)])],2)}const ke=k(Q,[["render",we],["__scopeId","data-v-65ce6e06"]]);const ye=t=>(Vue.pushScopeId("data-v-0048db38"),t=t(),Vue.popScopeId(),t),Ee={class:"get-cursor"},Ce=["innerHTML"],Ne={class:"toolbar"},Te=ye(()=>Vue.createElementVNode("span",null,"请尽量让自己的回复能够对别人有帮助",-1)),xe={__name:"PostEditor",props:{replyUser:null,replyFloor:null,useType:{type:String,default(){return"reply-comment"}}},emits:["close"],setup(t,{emit:e}){const s=t,{replyUser:i,replyFloor:o,useType:n}=s,u=i?`@${i} #${o} `:"",p=Vue.inject("post");Vue.inject("show"),Vue.inject("pageType");const V=Vue.inject("allReplyUsers");let l=Vue.ref(!1);const m=Vue.ref(!1),c=Vue.ref("editorId_"+Date.now()),d=Vue.ref(u),h=Vue.ref(null),M=Vue.ref(null),G=Vue.ref('<span style="white-space:pre-wrap;"> </span>'),z=Vue.computed(()=>[n,l.value?"isFocus":""]),W=Vue.computed(()=>{var f;if(!h.value||!d.value)return"";let _=((f=h.value)==null?void 0:f.selectionStart)||0;return d.value.substring(0,_).replace(/</g,"<").replace(/>/g,">").replace(/\n/g,"<br/>").replace(/\s/g,G.value)}),L=Vue.computed(()=>d.value?d.value===u:!0);async function F(){if(L.value||m.value)return;m.value=!0;let _={thankCount:0,isThanked:!1,isOp:p.value.username===window.user.username,id:Date.now(),username:window.user.username,avatar:window.user.avatar,date:"几秒前",floor:p.value.replyCount+1,reply_content:d.value||Date.now(),children:[],replyUsers:i?[i]:[],replyFloor:o||-1},f=d.value.match(/@([\w]+?[\s])/g);f&&f.map(v=>{let g=v.replace("@","").replace(" ","");_.reply_content=_.reply_content.replace(g,`<a href="/member/${g}">${g}</a>`)});let w=`${window.baseUrl}/t/${p.value.id}`;$.post(w,{content:d.value,once:p.value.once}).then(v=>{m.value=!1;let g=v.search("你上一条回复的内容和这条相同");if(g>-1)return r.emit(a.SHOW_MSG,{type:"error",text:"你上一条回复的内容和这条相同"});if(g=v.search("请不要在每一个回复中都包括外链，这看起来像是在 spamming"),g>-1)return r.emit(a.SHOW_MSG,{type:"error",text:"请不要在每一个回复中都包括外链，这看起来像是在 spamming"});if(g=v.search("你上一条回复的内容和这条相同"),g>-1)return r.emit(a.SHOW_MSG,{type:"error",text:"你上一条回复的内容和这条相同"});if(v.search("创建新回复")>-1)return r.emit(a.REFRESH_ONCE,v),r.emit(a.SHOW_MSG,{type:"error",text:"回复失败"});d.value=u,e("close"),r.emit(a.REFRESH_ONCE,v),r.emit(a.SHOW_MSG,{type:"success",text:"回复成功"}),console.log("item",_),r.emit(a.ADD_REPLY,_)},v=>{m.value=!1,r.emit(a.SHOW_MSG,{type:"error",text:"回复失败"})})}function y(){r.emit(a.SHOW_CALL,{show:!1}),r.off(a.SET_CALL)}function O(){h.value.style.height=0,h.value.style.height=h.value.scrollHeight+"px"}function C(_){let f=M.value.getBoundingClientRect();r.emit(a.SHOW_CALL,{show:!0,top:f.top,left:f.left,text:_}),r.off(a.SET_CALL),r.on(a.SET_CALL,w=>{let v=h.value.selectionStart,g=d.value.slice(0,v),B=d.value.slice(v,d.value.length),K=g.lastIndexOf("@");g=d.value.slice(0,K+1),w==="管理员"&&(w="Livid @Kai @Olivia @GordianZ @sparanoid",setTimeout(O)),w==="所有人"&&(w=V.value.map((D,Z)=>Z?"@"+D:D).join(" "),setTimeout(O)),d.value=g+w+" "+B;let I=g.length+w.length+1;setTimeout(()=>{h.value.setSelectionRange(I,I)}),r.off(a.SET_CALL)})}function j(_){switch(_.keyCode){case 8:d.value==="@"&&y();break;case 37:case 38:case 39:case 40:setTimeout(()=>H({data:""}),100);break;case 27:return _.preventDefault(),_.stopPropagation(),_.stopImmediatePropagation(),!1}}function H(_){let f=h.value.selectionStart;if(d.value){if(_.data===" ")return y();if(_.data==="@"){if(d.value.length!==1){if(d.value[f-2]===" "||d.value[f-2]===`
`)return C("")}else return C("");y()}else{let w=d.value.slice(0,f),v=w.lastIndexOf("@");if(v===-1)return y();let g=w.slice(v,f);if(g.includes(" "))y();else{if(v===0)return C(g.replace("@",""));if(d.value.length!==1){if(d.value[v-1]===" "||d.value[v-1]===`
`)return C(g.replace("@",""))}else return C(g.replace("@",""));y()}}}}function U(){l.value=!1}return Vue.onMounted(()=>{$(`.${c.value}`).each(function(){this.setAttribute("style","height:"+this.scrollHeight+"px;overflow-y:hidden;")}).on("input",function(){this.style.height=0,this.style.height=this.scrollHeight+"px"}),n==="reply-comment"&&h.value&&h.value.focus()}),Vue.onBeforeUnmount(()=>{$(`.${c.value}`).off()}),(_,f)=>(Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["post-editor-wrapper",Vue.unref(z)])},[Vue.withDirectives(Vue.createElementVNode("textarea",{class:Vue.normalizeClass(["post-editor",c.value]),ref_key:"txtRef",ref:h,onFocus:f[0]||(f[0]=w=>Vue.isRef(l)?l.value=!0:l=!0),onBlur:U,onInput:H,onKeydown:j,"onUpdate:modelValue":f[1]||(f[1]=w=>d.value=w)},null,34),[[Vue.vModelText,d.value]]),Vue.createElementVNode("div",Ee,[Vue.createElementVNode("span",{innerHTML:Vue.unref(W)},null,8,Ce),Vue.createElementVNode("span",{class:"cursor",ref_key:"cursorRef",ref:M},"|",512)]),Vue.createElementVNode("div",Ne,[Te,Vue.createElementVNode("div",{class:Vue.normalizeClass(["button",{disabled:Vue.unref(L),loading:m.value}]),onClick:F},"回复 ",2)])],2))}},R=k(xe,[["__scopeId","data-v-0048db38"]]);const Se={key:0,class:"html-wrapper"},Be=["innerHTML"],be={__name:"BaseHtmlRender",props:["html"],setup(t){const e=t,s=Vue.inject("config"),i=Vue.ref(null),o=900,n=Vue.ref(!1),u=Vue.ref(!1);function p(l){if(!s.value.base64)return;let m=window.win().getSelection().toString();if(m){let c=m.match(/([A-Za-z0-9+/=]+)/g);if(c){if(c[0].length<4)return;r.emit(a.SHOW_TOOLTIP,{text:c[0],e:l})}}}Vue.watch(s.value,l=>{l.contentAutoCollapse||(n.value=!1)}),Vue.watch([()=>i.value,()=>e.html],()=>{!i.value||!e.html||s.value.contentAutoCollapse&&(i.value.querySelectorAll("img").forEach(l=>{l.removeEventListener("load",V),l.addEventListener("load",V)}),V())},{immediate:!0,flush:"post"});function V(){if(u.value)return;let l=i.value.getBoundingClientRect();n.value=l.height>=o}return(l,m)=>e.html?(Vue.openBlock(),Vue.createElementBlock("div",Se,[Vue.createElementVNode("div",{class:Vue.normalizeClass({mask:n.value})},[Vue.createElementVNode("div",Vue.mergeProps({ref_key:"contentRef",ref:i},l.$attrs,{innerHTML:e.html,onMouseup:p}),null,16,Be)],2),n.value?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:"expand",onClick:m[0]||(m[0]=c=>{n.value=!1,u.value=!0})},"展开")):Vue.createCommentVNode("",!0)])):Vue.createCommentVNode("",!0)}},A=k(be,[["__scopeId","data-v-6959f800"]]);const Me={name:"Comment",components:{BaseHtmlRender:A,Author:ke,PostEditor:R,Point:b},props:{modelValue:{reply_content:""}},data(){return{edit:!1,expand:!0,replyInfo:`@${this.modelValue.username} #${this.modelValue.floor} `,cssStyle:null}},inject:["post","postDetailWidth","show"],watch:{show(t){t&&(this.edit=!1)}},created(){},mounted(){let t=this.$refs.comment.getBoundingClientRect(),e=this.postDetailWidth/2;if(e<t.width&&t.width<e+25&&this.modelValue.children.length){this.expand=!1;let s=2;this.cssStyle={padding:"1rem 0",width:`calc(${this.postDetailWidth}px - ${s}rem)`,transform:`translateX(calc(${t.width-this.postDetailWidth}px + ${s}rem))`}}},methods:{hide(){let t=`${window.baseUrl}/ignore/reply/${this.modelValue.id}?once=${this.post.once}`;r.emit(a.REMOVE,this.modelValue.floor),$.post(t).then(e=>{r.emit(a.REFRESH_ONCE),r.emit(a.SHOW_MSG,{type:"success",text:"隐藏成功"})},e=>{r.emit(a.SHOW_MSG,{type:"warning",text:"隐藏成功,仅本次有效（接口调用失败！）"})})},toggle(){this.expand=!this.expand}}},E=t=>(Vue.pushScopeId("data-v-55446f68"),t=t(),Vue.popScopeId(),t),Le={class:"comment-content"},Oe={class:"right"},He={class:"w"},Ie={key:0,class:"warning"},De=E(()=>Vue.createElementVNode("br",null,null,-1)),Re=E(()=>Vue.createElementVNode("br",null,null,-1)),Ae=E(()=>Vue.createElementVNode("br",null,null,-1)),Pe=E(()=>Vue.createElementVNode("br",null,null,-1)),Ge=E(()=>Vue.createElementVNode("br",null,null,-1)),ze=E(()=>Vue.createElementVNode("a",{href:"https://github.com/zyronon/v2ex-script/discussions/7",target:"_blank"},"这里",-1));function We(t,e,s,i,o,n){const u=Vue.resolveComponent("Author"),p=Vue.resolveComponent("BaseHtmlRender"),V=Vue.resolveComponent("PostEditor"),l=Vue.resolveComponent("Comment",!0);return Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["comment",s.modelValue.isOp?"op":""]),ref:"comment"},[Vue.createVNode(u,{modelValue:o.expand,"onUpdate:modelValue":e[0]||(e[0]=m=>o.expand=m),comment:s.modelValue,onReply:e[1]||(e[1]=m=>o.edit=!o.edit),onHide:n.hide},null,8,["modelValue","comment","onHide"]),o.cssStyle&&!o.expand?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:"more ago",onClick:e[2]||(e[2]=m=>o.expand=!o.expand)}," 由于嵌套回复层级太深，自动将后续回复隐藏 ")):Vue.createCommentVNode("",!0),Vue.withDirectives(Vue.createElementVNode("div",{class:"comment-content-w",style:Vue.normalizeStyle(o.cssStyle)},[o.cssStyle?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:"more ago",onClick:e[3]||(e[3]=m=>o.expand=!o.expand)}," 由于嵌套回复层级太深，自动将以下回复移至可见范围 ")):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",Le,[Vue.createElementVNode("div",{class:"left expand-line",onClick:e[4]||(e[4]=(...m)=>n.toggle&&n.toggle(...m))}),Vue.createElementVNode("div",Oe,[Vue.createElementVNode("div",He,[Vue.createVNode(p,{class:"text",html:s.modelValue.reply_content},null,8,["html"]),s.modelValue.isWrong?(Vue.openBlock(),Vue.createElementBlock("div",Ie,[Vue.createTextVNode(" 这条回复似乎有点问题，指定的楼层号与@的人对应不上 "),De,Vue.createTextVNode(" 原因可能有下面几种： "),Re,Vue.createTextVNode(" 一、屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1 "),Ae,Vue.createTextVNode(" 二、忽略回复导致楼层塌陷：原理同上 "),Pe,Vue.createTextVNode(" 三、层主回复时指定错了楼层号（同一，层主屏蔽了别人，导致楼层塌陷） "),Ge,Vue.createTextVNode(" 四、脚本解析错误，请在"),ze,Vue.createTextVNode("反馈给 ")])):Vue.createCommentVNode("",!0),o.edit?(Vue.openBlock(),Vue.createBlock(V,{key:1,onClose:e[5]||(e[5]=m=>o.edit=!1),replyInfo:o.replyInfo,replyUser:s.modelValue.username,replyFloor:s.modelValue.floor},null,8,["replyInfo","replyUser","replyFloor"])):Vue.createCommentVNode("",!0)]),(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(s.modelValue.children,(m,c)=>(Vue.openBlock(),Vue.createBlock(l,{modelValue:s.modelValue.children[c],"onUpdate:modelValue":d=>s.modelValue.children[c]=d,key:c},null,8,["modelValue","onUpdate:modelValue"]))),128))])]),o.cssStyle?(Vue.openBlock(),Vue.createElementBlock("div",{key:1,class:"more ago",onClick:e[6]||(e[6]=m=>o.expand=!o.expand)}," 由于嵌套回复层级太深，自动将以上回复移至可见范围 ")):Vue.createCommentVNode("",!0)],4),[[Vue.vShow,o.expand]])],2)}const Fe=k(Me,[["render",We],["__scopeId","data-v-55446f68"]]);const je={name:"Toolbar",inject:["isLogin","post","pageType"],data(){return{timer:null,loading:!1,loading2:!1,loading3:!1}},methods:{checkIsLogin(t=""){return this.isLogin?(this.$emit(t),!0):(r.emit(a.SHOW_MSG,{type:"warning",text:"请先登录！"}),!1)},getColor(t){return t?"#ff4500":"#929596"},getIsFull(t){return t?"#ff4500":"none"},tweet(){if(!this.checkIsLogin())return;let t=window.user.username,e=`https://twitter.com/intent/tweet?url=${window.baseUrl}/t/${this.post.id}?r=${t}&related=v2ex&text=${this.post.title}`;window.win().open(e,"_blank","width=550,height=370")},report(){if(!this.checkIsLogin()||!this.isLogin||this.post.isReport)return;let t=window.user.username,e=`https://twitter.com/share?url=${window.baseUrl}/t/${this.post.id}?r=${t}&amp;related=v2ex&amp;hashtags=apple&amp;text=${this.post.title}`;window.win().open(e,"_blank","width=550,height=370")},async toggleIgnore(){if(!this.checkIsLogin())return;let t=`${window.baseUrl}/${this.post.isIgnore?"unignore":"ignore"}/topic/${this.post.id}?once=${this.post.once}`;this.pageType==="post"?(this.loading2=!0,(await window.win().fetch(t)).redirected?(this.post.isIgnore||(window.win().location=window.baseUrl),r.emit(a.SHOW_MSG,{type:"success",text:this.post.isIgnore?"取消成功":"忽略成功"}),r.emit(a.MERGE,{isIgnore:!this.post.isIgnore})):r.emit(a.SHOW_MSG,{type:"warning",text:"忽略失败"}),this.loading2=!1):(this.post.isIgnore?this.loading2=!0:r.emit(a.IGNORE),(await window.win().fetch(t)).redirected?(this.post.isIgnore&&r.emit(a.REFRESH_ONCE),r.emit(a.SHOW_MSG,{type:"success",text:this.post.isIgnore?"取消成功":"忽略成功"}),r.emit(a.MERGE,{isIgnore:!this.post.isIgnore})):r.emit(a.SHOW_MSG,{type:"warning",text:"忽略成功,仅本次有效（接口调用失败！）"}),this.loading2=!1)},async toggleFavorite(){if(!this.checkIsLogin())return;this.loading=!0;let t=`${window.baseUrl}/${this.post.isFavorite?"unfavorite":"favorite"}/topic/${this.post.id}?once=${this.post.once}`,e=await window.win().fetch(t);if(this.loading=!1,e.redirected){let s=await e.text();if(s.search(this.post.isFavorite?"加入收藏":"取消收藏")){r.emit(a.MERGE,{collectCount:this.post.isFavorite?this.post.collectCount-1:this.post.collectCount+1}),r.emit(a.SHOW_MSG,{type:"success",text:this.post.isFavorite?"取消成功":"收藏成功"}),r.emit(a.REFRESH_ONCE,s),r.emit(a.MERGE,{isFavorite:!this.post.isFavorite});return}}r.emit(a.SHOW_MSG,{type:"error",text:"操作失败"})}}},P=t=>(Vue.pushScopeId("data-v-25defeac"),t=t(),Vue.popScopeId(),t),Ue={class:"toolbar"},$e=Vue.createStaticVNode('<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-25defeac><path d="M4 6H44V36H29L24 41L19 36H4V6Z" fill="none" stroke="#929596" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-25defeac></path><path d="M23 21H25.0025" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-25defeac></path><path d="M33.001 21H34.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-25defeac></path><path d="M13.001 21H14.9999" stroke="#929596" stroke-width="2" stroke-linecap="round" data-v-25defeac></path></svg><span data-v-25defeac>回复</span>',2),Ke=[$e],Ze={viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},qe=["fill","stroke"],Xe={key:1,class:"tool no-hover"},Ye=P(()=>Vue.createElementVNode("svg",{viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[Vue.createElementVNode("path",{d:"M28 6H42V20",stroke:"#929596","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"}),Vue.createElementVNode("path",{d:"M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6",stroke:"#929596","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"}),Vue.createElementVNode("path",{d:"M25.7998 22.1999L41.0998 6.8999",stroke:"#929596","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})],-1)),Je=P(()=>Vue.createElementVNode("span",null,"Tweet",-1)),Qe=[Ye,Je],et={viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},tt=["fill","stroke"],ot=["fill","stroke"],nt=["fill","stroke"],st=Vue.createStaticVNode('<svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-25defeac><path d="M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z" fill="#929596" stroke="#929596" stroke-width="4" stroke-linejoin="round" data-v-25defeac></path><path d="M8 42H40" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-25defeac></path><path d="M4 13L7 14" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-25defeac></path><path d="M13 3.9999L14 6.9999" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-25defeac></path><path d="M10.0001 9.99989L7.00009 6.99989" stroke="#929596" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" data-v-25defeac></path></svg>',1);function lt(t,e,s,i,o,n){return Vue.openBlock(),Vue.createElementBlock("div",Ue,[Vue.createElementVNode("div",{class:"tool",onClick:e[0]||(e[0]=u=>n.checkIsLogin("reply"))},Ke),n.post.once?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:Vue.normalizeClass(["tool",{loading:o.loading}]),onClick:e[1]||(e[1]=(...u)=>n.toggleFavorite&&n.toggleFavorite(...u))},[(Vue.openBlock(),Vue.createElementBlock("svg",Ze,[Vue.createElementVNode("path",{d:"M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z",fill:n.getIsFull(n.post.isFavorite),stroke:n.getColor(n.post.isFavorite),"stroke-width":"2","stroke-linejoin":"round"},null,8,qe)])),Vue.createElementVNode("span",null,Vue.toDisplayString(n.post.isFavorite?"取消收藏":"加入收藏"),1)],2)):Vue.createCommentVNode("",!0),n.post.once&&n.post.collectCount!==0?(Vue.openBlock(),Vue.createElementBlock("div",Xe,[Vue.createElementVNode("span",null,Vue.toDisplayString(n.post.collectCount+"人收藏"),1)])):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",{class:"tool",onClick:e[2]||(e[2]=(...u)=>n.tweet&&n.tweet(...u))},Qe),n.post.once?(Vue.openBlock(),Vue.createElementBlock("div",{key:2,class:Vue.normalizeClass(["tool",{loading:o.loading2}]),onClick:e[3]||(e[3]=(...u)=>n.toggleIgnore&&n.toggleIgnore(...u))},[(Vue.openBlock(),Vue.createElementBlock("svg",et,[Vue.createElementVNode("path",{fill:n.getIsFull(n.post.isIgnore),stroke:n.getColor(n.post.isIgnore),d:"M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},null,8,tt),Vue.createElementVNode("path",{fill:n.getIsFull(n.post.isIgnore),d:"M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705",stroke:n.getColor(n.post.isIgnore),"stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},null,8,ot),Vue.createElementVNode("path",{d:"M42 42L6 6",fill:n.getIsFull(n.post.isIgnore),stroke:n.getColor(n.post.isIgnore),"stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},null,8,nt)])),Vue.createElementVNode("span",null,Vue.toDisplayString(n.post.isIgnore?"取消忽略":"忽略主题"),1)],2)):Vue.createCommentVNode("",!0),n.post.once&&n.post.isLogin?(Vue.openBlock(),Vue.createElementBlock("div",{key:3,class:Vue.normalizeClass(["tool",{loading:o.loading3,"no-hover":n.post.isLogin}]),onClick:e[4]||(e[4]=(...u)=>n.report&&n.report(...u))},[st,Vue.createElementVNode("span",null,Vue.toDisplayString(n.post.isReport?"你已对本主题进行了报告":"报告这个主题"),1)],2)):Vue.createCommentVNode("",!0)])}const it=k(je,[["render",lt],["__scopeId","data-v-25defeac"]]);const rt={name:"detail",components:{Comment:Fe,PostEditor:R,Point:b,Toolbar:it,BaseHtmlRender:A},inject:["allReplyUsers","post","isLogin","config","pageType"],provide(){return{postDetailWidth:Vue.computed(()=>{var t;return((t=this.$refs.comments)==null?void 0:t.getBoundingClientRect().width)||0})}},props:{modelValue:{type:Boolean,default(){return!1}},loading:{type:Boolean,default(){return!1}},isNight:{type:Boolean,default(){return!1}},displayType:0},data(){return{isSticky:!1,selectCallIndex:0,postDetailWidth:0,showCallList:!1,replyText:"",callStyle:{top:0,left:0}}},computed:{filterCallList(){return this.showCallList?this.replyText?["管理员","所有人"].concat(this.allReplyUsers).filter(t=>t.search(this.replyText)>-1):["管理员","所有人"].concat(this.allReplyUsers):[]},replies(){return this.displayType===0?this.post.nestedReplies:this.displayType===1?window.clone(this.post.nestedReplies).sort((t,e)=>e.thankCount-t.thankCount):this.displayType===2?this.post.replies:[]}},watch:{modelValue:{handler(t){this.pageType!=="post"&&(t?(window.win().doc.body.style.overflow="hidden",this.$nextTick(()=>{var e,s,i,o;(s=(e=this.$refs)==null?void 0:e.main)==null||s.focus(),(o=(i=this.$refs)==null?void 0:i.detail)==null||o.scrollTo({top:0})})):(window.win().doc.body.style.overflow="unset",this.isSticky=!1,(this.pageType==="home"||this.pageType==="nodePage")&&window.win().location.pathname!=="/"&&window.win().history.back()))}}},mounted(){this.isLogin&&(new IntersectionObserver(([e])=>e.target.toggleAttribute("stuck",e.intersectionRatio<1),{threshold:[1]}).observe(this.$refs.replyBox),window.win().addEventListener("keydown",this.onKeyDown)),r.on(a.SHOW_CALL,t=>{t.show?(this.showCallList=!0,this.replyText=t.text,this.pageType==="post"?this.callStyle.top=t.top+$(window.win()).scrollTop()+-40+"px":this.callStyle.top=t.top+$(".post-detail").scrollTop()+15+"px",this.callStyle.left=t.left-$(".main")[0].getBoundingClientRect().left+10+"px",this.selectCallIndex>=this.filterCallList.length&&(this.selectCallIndex=0)):(this.replyText="",this.showCallList=!1,this.selectCallIndex=0)})},beforeUnmount(){window.win().removeEventListener("keydown",this.onKeyDown),r.off(a.SHOW_CALL)},methods:{close(t){this.pageType!=="post"&&(t==="space"?this.config.closePostDetailBySpace&&this.$emit("update:modelValue",!1):this.$emit("update:modelValue",!1))},setCall(t){r.emit(a.SET_CALL,t),this.showCallList=!1},onKeyDown(t){if(!this.modelValue||!this.showCallList)return;let e=this.filterCallList.slice(0,10).length;t.keyCode===13&&(this.setCall(this.filterCallList[this.selectCallIndex]),t.preventDefault()),t.keyCode===38&&(this.selectCallIndex--,this.selectCallIndex<0&&(this.selectCallIndex=e-1),t.preventDefault()),t.keyCode===40&&(this.selectCallIndex++,this.selectCallIndex>e-1&&(this.selectCallIndex=0),t.preventDefault())},changeOption(t){this.$emit("update:displayType",t)},addThank(){r.emit(a.CHANGE_POST_THANK,{id:this.post.id,type:"add"})},recallThank(){r.emit(a.CHANGE_POST_THANK,{id:this.post.id,type:"recall"})},scrollTop(){this.pageType==="post"?$("body , html").animate({scrollTop:0},300):this.$refs.detail.scrollTo({top:0,behavior:"smooth"})}}},x=t=>(Vue.pushScopeId("data-v-7d619111"),t=t(),Vue.popScopeId(),t),at={class:"main-wrapper"},ct={class:"my-box post-wrapper"},ut={class:"toolbar-wrapper"},dt={key:0,class:"my-box comment-wrapper"},mt={key:0,class:"flex"},pt={class:"radio-group2"},Vt={class:"my-cell flex"},ht={class:"gray"},ft={key:0},gt=x(()=>Vue.createElementVNode("strong",{class:"snow"},"•",-1)),vt=["innerHTML"],_t={key:1,class:"loading-wrapper"},wt={key:2,class:"comments",ref:"comments"},kt={key:1,id:"no-comments-yet"},yt={class:"my-cell flex"},Et=x(()=>Vue.createElementVNode("span",null,"添加一条新回复",-1)),Ct={class:"notice-right"},Nt={class:"w"},Tt=["onClick"],xt=x(()=>Vue.createElementVNode("i",{class:"fa fa-times","aria-hidden":"true"},null,-1)),St=[xt],Bt=x(()=>Vue.createElementVNode("i",{class:"fa fa-long-arrow-up","aria-hidden":"true"},null,-1)),bt=[Bt];function Mt(t,e,s,i,o,n){const u=Vue.resolveComponent("BaseHtmlRender"),p=Vue.resolveComponent("Point"),V=Vue.resolveComponent("Toolbar"),l=Vue.resolveComponent("Comment"),m=Vue.resolveComponent("PostEditor");return Vue.withDirectives((Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["post-detail",[s.isNight?"isNight":"",n.pageType]]),ref:"detail",onKeydown:e[11]||(e[11]=Vue.withKeys(c=>n.close(),["esc"])),onClick:e[12]||(e[12]=c=>n.close("space"))},[Vue.createElementVNode("div",{ref:"main",class:"main",tabindex:"1",onClick:e[10]||(e[10]=Vue.withModifiers(()=>{},["stop"]))},[Vue.createElementVNode("div",at,[Vue.createElementVNode("div",ct,[Vue.createVNode(u,{html:n.post.headerTemplate},null,8,["html"]),Vue.createElementVNode("div",ut,[Vue.createVNode(p,{onAddThank:n.addThank,onRecallThank:n.recallThank,item:{isThanked:n.post.isThanked,thankCount:n.post.thankCount,username:n.post.username},"api-url":"topic/"+n.post.id},null,8,["onAddThank","onRecallThank","item","api-url"]),Vue.createVNode(V,{onReply:e[0]||(e[0]=c=>o.isSticky=!o.isSticky)})])]),n.replies.length||s.loading?(Vue.openBlock(),Vue.createElementBlock("div",dt,[n.config.showToolbar?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:Vue.normalizeClass(["my-cell flex",n.pageType!=="post"&&"flex-end"])},[n.pageType==="post"?(Vue.openBlock(),Vue.createElementBlock("div",mt,[Vue.createTextVNode(" 默认显示楼中楼： "),Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:n.config.autoOpenDetail}]),onClick:e[1]||(e[1]=c=>n.config.autoOpenDetail=!n.config.autoOpenDetail)},null,2)])):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",pt,[Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",s.displayType===0?"active":""]),onClick:e[2]||(e[2]=c=>n.changeOption(0))},"楼中楼 ",2),Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",s.displayType===1?"active":""]),onClick:e[3]||(e[3]=c=>n.changeOption(1))},"感谢 ",2),Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",s.displayType===2?"active":""]),onClick:e[4]||(e[4]=c=>n.changeOption(2))},"V2原版 ",2)])],2)):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",Vt,[Vue.createElementVNode("span",ht,[Vue.createTextVNode(Vue.toDisplayString(n.post.replyCount)+" 条回复 ",1),n.post.createDate?(Vue.openBlock(),Vue.createElementBlock("span",ft,[Vue.createTextVNode("  "),gt,Vue.createTextVNode("  "+Vue.toDisplayString(n.post.createDate),1)])):Vue.createCommentVNode("",!0)]),Vue.createElementVNode("div",{class:"fr",innerHTML:n.post.fr},null,8,vt)]),s.loading?(Vue.openBlock(),Vue.createElementBlock("div",_t,[Vue.createElementVNode("div",{class:Vue.normalizeClass([s.isNight?"loading-b":"loading-c"])},null,2)])):(Vue.openBlock(),Vue.createElementBlock("div",wt,[s.modelValue?(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,{key:0},Vue.renderList(n.replies,(c,d)=>(Vue.openBlock(),Vue.createBlock(l,{key:c.floor,style:Vue.normalizeStyle(`border-bottom: 1px solid ${s.isNight?"#22303f":"#f2f2f2"};  padding: 1rem;margin-top: 0;`),modelValue:n.replies[d],"onUpdate:modelValue":h=>n.replies[d]=h},null,8,["style","modelValue","onUpdate:modelValue"]))),128)):Vue.createCommentVNode("",!0)],512))])):(Vue.openBlock(),Vue.createElementBlock("div",kt,"目前尚无回复")),n.isLogin?(Vue.openBlock(),Vue.createElementBlock("div",{key:2,class:Vue.normalizeClass(["my-box editor-wrapper",{sticky:o.isSticky}]),ref:"replyBox"},[Vue.createElementVNode("div",yt,[Et,Vue.createElementVNode("div",Ct,[o.isSticky?(Vue.openBlock(),Vue.createElementBlock("a",{key:0,class:"float",onClick:e[5]||(e[5]=c=>o.isSticky=!1)},"取消回复框停靠")):Vue.createCommentVNode("",!0),Vue.createElementVNode("a",{onClick:e[6]||(e[6]=(...c)=>n.scrollTop&&n.scrollTop(...c))},"回到顶部")])]),Vue.createElementVNode("div",Nt,[s.modelValue?(Vue.openBlock(),Vue.createBlock(m,{key:0,useType:"reply-post",onClick:e[7]||(e[7]=c=>o.isSticky=!0)})):Vue.createCommentVNode("",!0)])],2)):Vue.createCommentVNode("",!0)]),o.showCallList&&n.filterCallList.length?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:"call-list",style:Vue.normalizeStyle(o.callStyle)},[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(n.filterCallList.slice(0,10),(c,d)=>(Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["call-item",{select:d===o.selectCallIndex}]),onClick:h=>n.setCall(c)},[Vue.createElementVNode("a",null,Vue.toDisplayString(c),1)],10,Tt))),256))],4)):Vue.createCommentVNode("",!0),n.config.closePostDetailBySpace?(Vue.openBlock(),Vue.createElementBlock("div",{key:1,class:"close-btn",onClick:e[8]||(e[8]=c=>n.close("btn"))},St)):Vue.createCommentVNode("",!0),Vue.createElementVNode("div",{class:"scroll-top button gray",onClick:e[9]||(e[9]=Vue.withModifiers((...c)=>n.scrollTop&&n.scrollTop(...c),["stop"]))},bt)],512)],34)),[[Vue.vShow,s.modelValue]])}const Lt=k(rt,[["render",Mt],["__scopeId","data-v-7d619111"]]);const Ot={class:"base-info"},Ht={class:"left"},It=["onClick","href"],Dt={class:"avatar"},Rt=["src"],At={class:"right"},Pt={class:"title"},Gt=["href"],zt={class:"bottom"},Wt=["onClick","href"],Ft=["onClick","href"],jt={class:"date"},Ut={key:0,class:"count"},$t=["innerHTML"],Kt={__name:"Post",props:["post","viewType","isNight"],setup(t){const e=t,s=200,i=Vue.ref(!1),o=Vue.ref(null),n=Vue.computed(()=>e.post.bg?{backgroundImage:e.post.bg,backgroundRepeat:"no-repeat",backgroundSize:"20px 20px",backgroundPosition:"right top"}:{});Vue.watch([()=>e.post,()=>o.value,()=>e.viewType],()=>{if(!o.value||e.viewType==="table")return;let p=o.value.getBoundingClientRect();o.value.querySelectorAll("img").forEach(V=>{V.addEventListener("load",u)}),i.value=p.height>=s},{immediate:!0,flush:"post"});function u(){if(i.value)return;let p=o.value.getBoundingClientRect();i.value=p.height>=s}return(p,V)=>(Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["post",[e.viewType,e.isNight?"isNight":""]]),style:Vue.normalizeStyle(Vue.unref(n)),onClick:V[0]||(V[0]=l=>p.$emit("show",l))},[Vue.createElementVNode("div",Ot,[Vue.createElementVNode("div",Ht,[Vue.createElementVNode("a",{onClick:Vue.withModifiers(l=>null,["stop"]),href:`/member/${e.post.username}`},[Vue.createElementVNode("div",Dt,[Vue.createElementVNode("img",{src:e.post.avatar,alt:""},null,8,Rt)])],8,It),Vue.createElementVNode("div",At,[Vue.createElementVNode("div",Pt,[Vue.createElementVNode("a",{href:`t/${e.post.id}`},Vue.toDisplayString(e.post.title),9,Gt)]),Vue.createElementVNode("div",zt,[e.post.node?(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,{key:0},[Vue.createElementVNode("a",{onClick:Vue.withModifiers(l=>null,["stop"]),href:e.post.nodeUrl,class:"my-node"},Vue.toDisplayString(e.post.node),9,Wt),Vue.createTextVNode("   •   ")],64)):Vue.createCommentVNode("",!0),Vue.createElementVNode("strong",null,[Vue.createElementVNode("a",{onClick:Vue.withModifiers(l=>null,["stop"]),class:"username",href:`/member/${e.post.username}`},Vue.toDisplayString(e.post.username),9,Ft)]),Vue.createTextVNode("   •   "),Vue.createElementVNode("span",jt,Vue.toDisplayString(e.post.date),1)])])]),e.post.replyCount?(Vue.openBlock(),Vue.createElementBlock("div",Ut,Vue.toDisplayString(e.post.replyCount),1)):Vue.createCommentVNode("",!0)]),e.post.content_rendered?(Vue.openBlock(),Vue.createElementBlock("div",{key:0,class:Vue.normalizeClass(["post-content-wrapper",{mask:i.value}])},[Vue.createElementVNode("div",{innerHTML:e.post.content_rendered,ref_key:"contentRef",ref:o},null,8,$t)],2)):Vue.createCommentVNode("",!0)],6))}},Zt=k(Kt,[["__scopeId","data-v-71df4ceb"]]),qt={name:"Msg",props:{type:"",text:""},created(){setTimeout(()=>{this.$emit("close")},3e3)}},Xt=Vue.createElementVNode("svg",{width:"24",height:"24",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[Vue.createElementVNode("path",{d:"M14 14L34 34",stroke:"#ffffff","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"}),Vue.createElementVNode("path",{d:"M14 34L34 14",stroke:"#ffffff","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"})],-1),Yt=[Xt],Jt={class:"right"};function Qt(t,e,s,i,o,n){return Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["msg",s.type])},[Vue.createElementVNode("div",{class:"left",onClick:e[0]||(e[0]=u=>t.$emit("close"))},Yt),Vue.createElementVNode("div",Jt,Vue.toDisplayString(s.text),1)],2)}const eo=k(qt,[["render",Qt]]);const to=t=>(Vue.pushScopeId("data-v-61690a22"),t=t(),Vue.popScopeId(),t),oo=to(()=>Vue.createElementVNode("svg",{width:"24",height:"24",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[Vue.createElementVNode("path",{d:"M17 32L19.1875 27M31 32L28.8125 27M19.1875 27L24 16L28.8125 27M19.1875 27H28.8125",stroke:"#929596","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"}),Vue.createElementVNode("path",{d:"M43.1999 20C41.3468 10.871 33.2758 4 23.5999 4C13.9241 4 5.85308 10.871 4 20L10 18",stroke:"#929596","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"}),Vue.createElementVNode("path",{d:"M4 28C5.85308 37.129 13.9241 44 23.5999 44C33.2758 44 41.3468 37.129 43.1999 28L38 30",stroke:"#929596","stroke-width":"4","stroke-linecap":"round","stroke-linejoin":"round"})],-1)),no={key:1},so={__name:"Base64Tooltip",setup(t){const e=Vue.ref(null),s=Vue.ref(!1),i=Vue.ref(""),o=Vue.ref(""),n=Vue.reactive({left:"-100vw",top:"-100vh"});Vue.onMounted(()=>{r.on(a.SHOW_TOOLTIP,({text:m,e:c})=>{setTimeout(()=>s.value=!0),i.value=m,o.value="",n.left=c.clientX+"px",n.top=c.clientY+20+"px"}),window.win().addEventListener("click",m=>{e.value&&!e.value.contains(m.target)&&s.value&&(s.value=!1)},{capture:!0});const l=()=>s.value&&(s.value=!1);$(".post-detail",window.win().doc).on("scroll",l)});function u(){window.win().navigator.clipboard?(window.win().navigator.clipboard.writeText(o.value),r.emit(a.SHOW_MSG,{type:"success",text:"复制成功"})):r.emit(a.SHOW_MSG,{type:"error",text:"复制失败！浏览器不支持！"})}function p(l){for(var m=window.atob(l),c=m.length,d=new Uint8Array(c),h=0;h<c;h++)d[h]=m.charCodeAt(h);return d.buffer}function V(){try{new Blob([p(i.value)]).text().then(l=>{o.value=l})}catch{r.emit(a.SHOW_MSG,{type:"error",text:"Base64解码失败！不是标准数据！"})}}return(l,m)=>Vue.withDirectives((Vue.openBlock(),Vue.createElementBlock("div",{class:"base64_tooltip",style:Vue.normalizeStyle(n),onClick:V,ref_key:"tooltip",ref:e},[o.value?(Vue.openBlock(),Vue.createElementBlock("div",no,[Vue.createElementVNode("span",null,Vue.toDisplayString(o.value),1),Vue.createElementVNode("div",{class:"button",onClick:u},"点击复制")])):(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,{key:0},[Vue.createTextVNode(" Base64解码："+Vue.toDisplayString(i.value)+" ",1),oo],64))],4)),[[Vue.vShow,s.value]])}},lo=k(so,[["__scopeId","data-v-61690a22"]]);const io={name:"home",provide(){return{isDev:Vue.computed(()=>!1),isLogin:Vue.computed(()=>this.isLogin),pageType:Vue.computed(()=>this.pageType),tags:Vue.computed(()=>this.tags),show:Vue.computed(()=>this.show),post:Vue.computed(()=>this.current),config:Vue.computed(()=>this.config),allReplyUsers:Vue.computed(()=>{var t,e,s;return(t=this.current)!=null&&t.replies?Array.from(new Set(((s=(e=this.current)==null?void 0:e.replies)==null?void 0:s.map(i=>i.username))??[])):[]})}},components:{PostDetail:Lt,Post:Zt,Msg:eo,Base64Tooltip:lo},data(){return{loading:window.pageType==="post",loadMore:!1,isLogin:!!window.user.username,pageType:window.pageType,isNight:window.isNight,msgList:[],show:!1,showConfig:!1,current:window.clone(window.initPost),list:[],config:window.config,tags:window.user.tags,tagModal:{show:!1,currentUsername:"",tag:""}}},computed:{isDev(){return!1},isList(){return this.pageType==="home"||this.pageType==="recent"||this.pageType==="nodePage"}},watch:{"current.replies":{handler(t,e){if(t.length){this.current.replyCount=t.length;let s=window.parse.createNestedList(t,this.current.allReplyUsers);s&&(this.current.nestedReplies=s)}else this.current.replyCount=0,this.current.nestedReplies=[];if(this.list){let s=this.list.findIndex(i=>i.id===this.current.id);s>-1&&(this.list[s].replyCount=t.length)}},deep:!0},config:{handler(t){let e={[window.user.username??"default"]:t};window.win().localStorage.setItem("v2ex-config",JSON.stringify(e)),window.config=t},deep:!0},tags(t){window.user.tags=t},"config.viewType"(t){t&&(t==="card"?$(".post-item").each(function(){$(this).addClass("preview")}):$(".post-item").each(function(){$(this).removeClass("preview")}))}},created(){window.cb=this.winCb,window.win().canParseV2exPage&&this.isList,$(window.win().doc).on("click","a",e=>{console.log("1");let{href:s,id:i,title:o}=window.parse.parseA(e.currentTarget);if(this.clickPost(e,i,s,o))return!1});let t=this;$(window.win().doc).on("click",".post-item",function(e){if(this.classList.contains("preview")&&e.target.tagName!=="A"&&e.target.tagName!=="IMG"&&!e.target.classList.contains("toggle")){let s=this.dataset.id,i=this.dataset.href;if(t.clickPost(e,s,i))return!1}}),$(window.win().doc).on("click",".toggle",e=>{let s=e.currentTarget.dataset.id,i=window.win().query(`.id_${s}`);i.classList.contains("preview")?i.classList.remove("preview"):i.classList.add("preview")}),window.win().onpopstate=e=>{e.state?this.show||(this.show=!0):this.show&&(this.show=!1)},this.initEvent()},beforeUnmount(){r.clear()},methods:{clickPost(t,e,s,i=""){var o,n,u,p,V,l;if(e&&this.config.clickPostItemOpenDetail){let m=this.list.findIndex(d=>d.id==e),c=this.clone(window.initPost);if(m>-1?c=this.list[m]:c.title=i??"加载中",c.id=e,c.href=s,!c.headerTemplate){let d=`
            <div class="header">
              <div class="fr">
                <a href="/member/${((o=c==null?void 0:c.member)==null?void 0:o.username)??""}">
                  <img src="${((n=c==null?void 0:c.member)==null?void 0:n.avatar_large)??""}" class="avatar"
                       border="0"
                       align="default" width="73" style="width: 73px; max-height: 73px;" alt="${((u=c==null?void 0:c.member)==null?void 0:u.username)??""}">
                </a>
              </div>
              <a href="/">V2EX</a> <span class="chevron">&nbsp;›&nbsp;</span> <a href="${((p=c==null?void 0:c.node)==null?void 0:p.url)??""}">${((V=c==null?void 0:c.node)==null?void 0:V.title)??""}</a>
              <div class="sep10"></div>
              <h1>${(c==null?void 0:c.title)||"加载中..."}</h1>
              <div id="topic_930514_votes" class="votes">
                <a href="javascript:" onclick="null" class="vote">
                  <li class="fa fa-chevron-up"></li>
                  &nbsp;
                </a> &nbsp;
                <a href="javascript:" onclick="null" class="vote">
                  <li class="fa fa-chevron-down"></li>
                </a>
              </div> &nbsp;
              <small class="gray">
                <a href="/member/zyronon">${((l=c==null?void 0:c.member)==null?void 0:l.username)??""}</a> ·
                <span title="2023-04-07 11:32:28 +08:00">1 天前</span> · 0 次点击
              </small>
            </div>
            <div class="cell">
              <div class="topic_content">
                <div class="markdown_body">
                 ${(c==null?void 0:c.content_rendered)??""}
                </div>
              </div>
            </div>
            `;c.headerTemplate=d}return this.getPostDetail(c),t.preventDefault(),!0}},showPost(){this.show=!0,$("#Wrapper #Main .box:lt(3)").each(function(){$(this).hide()})},async addTag(){let t=this.clone(this.tags),e=this.tags[this.tagModal.currentUsername]??[];if(e.findIndex(o=>o===this.tagModal.tag)>-1){r.emit(a.SHOW_MSG,{type:"warning",text:"标签已存在！"});return}else e.push(this.tagModal.tag);this.tags[this.tagModal.currentUsername]=e,this.tagModal.tag="",this.tagModal.show=!1;let i=await window.parse.saveTags(this.tags);return i||(r.emit(a.SHOW_MSG,{type:"error",text:"标签添加失败！"}),this.tags=t),console.log("res",i),console.log(this.tags)},async winCb({type:t,value:e}){t==="openSetting"&&(this.showConfig=!0),t==="postContent"&&(this.current=Object.assign(this.clone(this.current),this.clone(e)),this.config.autoOpenDetail&&this.showPost()),t==="postReplies"&&(this.current=Object.assign(this.clone(this.current),this.clone(e)),console.log("当前帖子",this.current),this.loading=!1),t==="syncData"&&(this.list=window.postList,this.config=window.config,this.tags=window.user.tags)},clone(t){return window.clone(t)},initEvent(){r.on(a.CHANGE_COMMENT_THANK,t=>{const{id:e,type:s}=t;let i=this.current.replies.findIndex(o=>o.id===e);i>-1&&(this.current.replies[i].isThanked=s==="add",s==="add"?this.current.replies[i].thankCount++:this.current.replies[i].thankCount--)}),r.on(a.CHANGE_POST_THANK,t=>{const{id:e,type:s}=t;this.current.isThanked=s==="add",s==="add"?this.current.thankCount++:this.current.thankCount--;let i=this.list.findIndex(o=>o.id===e);i>-1&&(this.list[i].isThanked=s==="add",s==="add"?this.list[i].thankCount++:this.list[i].thankCount++)}),r.on(a.REMOVE,t=>{let e=this.current.replies.findIndex(i=>i.floor===t);e>-1&&this.current.replies.splice(e,1);let s=this.list.findIndex(i=>i.id===this.current.id);s>-1&&(this.list[s]=Object.assign(this.list[s],t))}),r.on(a.SHOW_MSG,t=>{this.msgList.push({...t,id:Date.now()})}),r.on(a.IGNORE,()=>{this.show=!1;let t=this.list.findIndex(e=>e.id===this.current.id);t>-1&&this.list.splice(t,1),this.current=this.clone(window.initPost)}),r.on(a.MERGE,t=>{this.current=Object.assign(this.current,t);let e=this.list.findIndex(s=>s.id===this.current.id);e>-1&&(this.list[e]=Object.assign(this.list[e],t))}),r.on(a.ADD_REPLY,t=>{this.current.replies.push(t)}),r.on(a.REFRESH_ONCE,async t=>{if(t){if(typeof t=="string"){let e=t.match(/var once = "([\d]+)";/);if(e&&e[1]){this.current.once=Number(e[1]);return}}if(typeof t=="number"){this.current.once=t;return}}window.win().fetchOnce().then(e=>{this.current.once=e})}),r.on(a.ADD_TAG,t=>{console.log("use",t),this.tagModal.currentUsername=t,this.tagModal.show=!0}),r.on(a.REMOVE_TAG,async({username:t,tag:e})=>{let s=this.clone(this.tags),i=this.tags[t]??[],o=i.findIndex(u=>u===e);o>-1&&i.splice(o,1),this.tags[t]=i,await window.parse.saveTags(this.tags)||(r.emit(a.SHOW_MSG,{type:"error",text:"标签删除失败！"}),this.tags=s)})},removeMsg(t){let e=this.msgList.findIndex(s=>s.id===t);e>-1&&this.msgList.splice(e,1)},async getPostDetail(t,e){this.show=!0,console.log("window.baseUrl",window.baseUrl);let s=window.baseUrl+"/t/"+t.id;window.win().doc.body.style.overflow="hidden",window.win().history.pushState({},0,t.href??s),this.current=Object.assign(this.clone(window.initPost),this.clone(t)),this.current.replies.length||(this.loading=!0);let i=await window.win().fetch(s+"?p=1");if(i.status===404)return r.emit(a.SHOW_MSG,{type:"error",text:"主题未找到"}),this.loading=!1;if(i.redirected)return r.emit(a.SHOW_MSG,{type:"error",text:"没有权限"}),this.loading=!1;let o=await i.text();if(o.search("你要查看的页面需要先登录")>-1)return r.emit(a.SHOW_MSG,{type:"error",text:"你要查看的页面需要先登录"}),this.loading=!1;let u=o.match(/<body[^>]*>([\s\S]+?)<\/body>/g),p=$(u[0]);if(this.current=await window.parse.getPostDetail(this.current,p,o),this.current.replies.length){let V=this.list.findIndex(l=>l.id==t.id);V>-1?(this.list[V].replies=this.current.replies,this.list[V].nestedReplies=this.current.nestedReplies,this.list[V].once=this.current.once,this.list[V].createDate=this.current.createDate):this.list.push(this.clone(this.current))}this.loading=!1,console.log("当前帖子",this.current)}}},ro={key:0,class:"nav flex flex-end"},ao=Vue.createElementVNode("span",null,"设置",-1),co=[ao],uo={class:"radio-group2"},mo={key:1,class:"my-box flex f14 open-post",style:{margin:"1rem 0 0 0",padding:"1rem"}},po={class:"flex"},Vo={class:"msgs"},ho={key:1,class:"setting-modal modal"},fo={class:"wrapper"},go=Vue.createElementVNode("div",{class:"title"}," 脚本设置 ",-1),vo=Vue.createElementVNode("div",{class:"sub-title"}," 设置自动保存到本地，下次打开依然生效 ",-1),_o={class:"option"},wo=Vue.createElementVNode("span",null,"显示工具栏：",-1),ko=Vue.createElementVNode("div",{class:"notice"},[Vue.createElementVNode("div",null," 关闭此选项后，页面上所有的脚本工具栏和按钮，均不显示。 "),Vue.createElementVNode("div",null," 点击右上角插件“Tampermonkey”，找到“V2EX - 超级增强”脚本，找到“脚本设置”选项，点击可再次打开本弹框修改设置 ")],-1),yo={class:"option"},Eo=Vue.createElementVNode("span",null,"列表帖子展示方式：",-1),Co={class:"radio-group2"},No={class:"option"},To=Vue.createElementVNode("span",null,"回复展示方式：",-1),xo={class:"radio-group2"},So={class:"option"},Bo=Vue.createElementVNode("span",null,"用户打标签：",-1),bo={class:"option"},Mo=Vue.createElementVNode("span",null,"单独打开帖子时默认显示楼中楼 ：",-1),Lo=Vue.createElementVNode("div",{class:"notice"}," 单独打开这种地址 https://v2ex.com/t/xxxx 时，是否默认显示楼中楼 ",-1),Oo={class:"option"},Ho=Vue.createElementVNode("span",null,"点击列表的帖子，打开详情弹框 ：",-1),Io=Vue.createElementVNode("div",{class:"notice"}," 若关闭此项，点击列表的帖子时，不会打开弹框，会跳转网页 ",-1),Do={class:"option"},Ro=Vue.createElementVNode("span",null,"新标签页打开链接 ：",-1),Ao=Vue.createElementVNode("div",{class:"notice"}," 此项需要刷新页面才能生效 ",-1),Po={class:"option"},Go=Vue.createElementVNode("span",null,"点击左右两侧透明处关闭帖子详情弹框：",-1),zo={class:"option"},Wo=Vue.createElementVNode("span",null,"正文超长自动折叠：",-1),Fo={class:"option"},jo=Vue.createElementVNode("span",null,"列表hover时显示预览按钮：",-1),Uo=Vue.createElementVNode("div",{class:"notice"}," 此项需要刷新页面才能生效 ",-1),$o={class:"option"},Ko=Vue.createElementVNode("span",null,"划词显示Base64解码框：",-1),Zo={class:"option"},qo=Vue.createElementVNode("span",null,"使用 SOV2EX 搜索：",-1),Xo=Vue.createElementVNode("div",{class:"notice"}," 此项需要刷新页面才能生效 ",-1),Yo=Vue.createElementVNode("div",{class:"jieshao"},null,-1),Jo={key:2,class:"tag-modal modal"},Qo={class:"wrapper"},en=Vue.createElementVNode("div",{class:"title"}," 添加标签 ",-1),tn={class:"option"},on=Vue.createElementVNode("span",null,"用户：",-1),nn={class:"btns"};function sn(t,e,s,i,o,n){const u=Vue.resolveComponent("PostDetail"),p=Vue.resolveComponent("Msg"),V=Vue.resolveComponent("Base64Tooltip");return Vue.openBlock(),Vue.createElementBlock("div",{class:Vue.normalizeClass(["app-home",[o.pageType,o.isNight?"isNight":""]])},[o.config.showToolbar?(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,{key:0},[n.isList?(Vue.openBlock(),Vue.createElementBlock("div",ro,[Vue.createElementVNode("div",{class:"nav-item",onClick:e[0]||(e[0]=l=>o.showConfig=!0)},co),Vue.createElementVNode("div",uo,[Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.viewType==="table"?"active":""]),onClick:e[1]||(e[1]=l=>o.config.viewType="table")},"表格 ",2),Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.viewType==="card"?"active":""]),onClick:e[2]||(e[2]=l=>o.config.viewType="card")},"卡片 ",2)])])):Vue.createCommentVNode("",!0),o.pageType==="post"&&!o.show?(Vue.openBlock(),Vue.createElementBlock("div",mo,[Vue.createElementVNode("div",po,[Vue.createTextVNode(" 默认显示楼中楼 ： "),Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.autoOpenDetail}]),onClick:e[3]||(e[3]=l=>o.config.autoOpenDetail=!o.config.autoOpenDetail)},null,2)]),Vue.createElementVNode("div",{class:Vue.normalizeClass(["button gray",{loading:o.loading}]),onClick:e[4]||(e[4]=(...l)=>n.showPost&&n.showPost(...l))}," 点击显示楼中楼 ",2)])):Vue.createCommentVNode("",!0)],64)):Vue.createCommentVNode("",!0),Vue.createVNode(u,{modelValue:o.show,"onUpdate:modelValue":e[5]||(e[5]=l=>o.show=l),isNight:o.isNight,displayType:o.config.commentDisplayType,"onUpdate:displayType":e[6]||(e[6]=l=>o.config.commentDisplayType=l),loading:o.loading},null,8,["modelValue","isNight","displayType","loading"]),Vue.createElementVNode("div",Vo,[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(o.msgList,l=>(Vue.openBlock(),Vue.createBlock(p,{key:l.id,type:l.type,text:l.text,onClose:m=>n.removeMsg(l.id)},null,8,["type","text","onClose"]))),128))]),Vue.createVNode(V),o.showConfig?(Vue.openBlock(),Vue.createElementBlock("div",ho,[Vue.createElementVNode("div",{class:"mask",onClick:e[7]||(e[7]=l=>o.showConfig=!o.showConfig)}),Vue.createElementVNode("div",fo,[go,vo,Vue.createElementVNode("div",_o,[wo,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.showToolbar}]),onClick:e[8]||(e[8]=l=>o.config.showToolbar=!o.config.showToolbar)},null,2)]),ko,Vue.createElementVNode("div",yo,[Eo,Vue.createElementVNode("div",Co,[Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.viewType==="table"?"active":""]),onClick:e[9]||(e[9]=l=>o.config.viewType="table")},"表格 ",2),Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.viewType==="card"?"active":""]),onClick:e[10]||(e[10]=l=>o.config.viewType="card")},"卡片 ",2)])]),Vue.createElementVNode("div",No,[To,Vue.createElementVNode("div",xo,[Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.commentDisplayType===0?"active":""]),onClick:e[11]||(e[11]=l=>o.config.commentDisplayType=0)},"楼中楼 ",2),Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.commentDisplayType===1?"active":""]),onClick:e[12]||(e[12]=l=>o.config.commentDisplayType=1)},"感谢最多 ",2),Vue.createElementVNode("div",{class:Vue.normalizeClass(["radio",o.config.commentDisplayType===2?"active":""]),onClick:e[13]||(e[13]=l=>o.config.commentDisplayType=2)},"V2原版 ",2)])]),Vue.createElementVNode("div",So,[Bo,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.openTag}]),onClick:e[14]||(e[14]=l=>o.config.openTag=!o.config.openTag)},null,2)]),Vue.createElementVNode("div",bo,[Mo,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.autoOpenDetail}]),onClick:e[15]||(e[15]=l=>o.config.autoOpenDetail=!o.config.autoOpenDetail)},null,2)]),Lo,Vue.createElementVNode("div",Oo,[Ho,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.clickPostItemOpenDetail}]),onClick:e[16]||(e[16]=l=>o.config.clickPostItemOpenDetail=!o.config.clickPostItemOpenDetail)},null,2)]),Io,Vue.createElementVNode("div",Do,[Ro,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.newTabOpen}]),onClick:e[17]||(e[17]=l=>o.config.newTabOpen=!o.config.newTabOpen)},null,2)]),Ao,Vue.createElementVNode("div",Po,[Go,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.closePostDetailBySpace}]),onClick:e[18]||(e[18]=l=>o.config.closePostDetailBySpace=!o.config.closePostDetailBySpace)},null,2)]),Vue.createElementVNode("div",zo,[Wo,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.contentAutoCollapse}]),onClick:e[19]||(e[19]=l=>o.config.contentAutoCollapse=!o.config.contentAutoCollapse)},null,2)]),Vue.createElementVNode("div",Fo,[jo,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.showPreviewBtn}]),onClick:e[20]||(e[20]=l=>o.config.showPreviewBtn=!o.config.showPreviewBtn)},null,2)]),Uo,Vue.createElementVNode("div",$o,[Ko,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.base64}]),onClick:e[21]||(e[21]=l=>o.config.base64=!o.config.base64)},null,2)]),Vue.createElementVNode("div",Zo,[qo,Vue.createElementVNode("div",{class:Vue.normalizeClass(["switch",{active:o.config.sov2ex}]),onClick:e[22]||(e[22]=l=>o.config.sov2ex=!o.config.sov2ex)},null,2)]),Xo,Yo])])):Vue.createCommentVNode("",!0),o.tagModal.show?(Vue.openBlock(),Vue.createElementBlock("div",Jo,[Vue.createElementVNode("div",{class:"mask",onClick:e[23]||(e[23]=Vue.withModifiers(l=>o.tagModal.show=!1,["stop"]))}),Vue.createElementVNode("div",Qo,[en,Vue.createElementVNode("div",tn,[on,Vue.createElementVNode("div",null,Vue.toDisplayString(o.tagModal.currentUsername),1)]),Vue.withDirectives(Vue.createElementVNode("input",{type:"text",autofocus:"","onUpdate:modelValue":e[24]||(e[24]=l=>o.tagModal.tag=l),onKeydown:e[25]||(e[25]=Vue.withKeys((...l)=>n.addTag&&n.addTag(...l),["enter"]))},null,544),[[Vue.vModelText,o.tagModal.tag]]),Vue.createElementVNode("div",nn,[Vue.createElementVNode("div",{class:"button info",onClick:e[26]||(e[26]=l=>o.tagModal.show=!1)},"取消"),Vue.createElementVNode("div",{class:"button",onClick:e[27]||(e[27]=(...l)=>n.addTag&&n.addTag(...l))},"确定")])])])):Vue.createCommentVNode("",!0)],2)}const ln=k(io,[["render",sn]]);let N;window.win().isFrame?N=$("#app",window.win().doc)[0]:N=window.win().query("#app");window.win().vue&&window.win().vue.unmount();let S=Vue.createApp(ln);window.win().vue=S;window.win().appNode=N;S.config.unwrapInjectedRef=!0;S.config.errorHandler=(t,e,s)=>{console.error("通过vue errorHandler捕获的错误"),console.error(t),console.error(e),console.error(s)};S.mount(N);
//# sourceMappingURL=index-43bd040c.js.map


  })

  const isDev = false

  //方便删除
  if (true){
    if (!isDev) {
      window.onerror = function (message, source, lineno, colno, error) {
        console.log('捕获到异常：', {message, source, lineno, colno, error});
      }
      window.addEventListener('error', (error) => {
        console.log('捕获到异常：', error);
      }, true)
      window.addEventListener("unhandledrejection", function (e) {
        e.preventDefault()
        console.log('捕获到异常：', e);
        return true;
      });
    }
    if (!window.GM_openInTab) window.GM_openInTab = () => void 0
    if (!window.GM_registerMenuCommand) window.GM_registerMenuCommand = () => void 0
    if (!window.GM_registerMenuCommand) window.GM_registerMenuCommand = () => void 0
    if (!window.GM_notification) window.GM_notification = () => void 0

    if (window.top !== window.self) {
      window.win = () => window.top
      // window.baseUrl = 'https://www.v2ex.com'
      window.baseUrl = window.top.location.origin
      window.win().isFrame = true
      //直接使用v2的jquery，因为v2对jquery作了修改，加了一些header，缺少这些header发送请求会报403
      window.$ = window.win().$
    } else {
      window.win = () => window
      //这里必须一致。不然会报跨域
      window.baseUrl = location.origin
      window.win().isFrame = false
    }

    window.initPost = {
      replies: [],
      nestedReplies: [],
      username: '',
      member: {},
      node: {},
      headerTemplate: '',
      title: '',
      id: '',
      type: 'post',
      once: '',
      replyCount: 0,
      clickCount: 0,
      thankCount: 0,
      collectCount: 0,
      isFavorite: false,
      isIgnore: false,
      isThanked: false,
      isReport: false,
    }
    window.win().doc = window.win().document
    window.win().query = (v) => window.win().document.querySelector(v)
    window.query = (v) => window.win().document.querySelector(v)
    window.clone = (val) => JSON.parse(JSON.stringify(val))
    window.user = {
      tagPrefix: '--用户标签--',
      tags: {},
      username: '',
      avatar: '',
      tagsId: ''
    }
    window.pageType = ''
    window.pageData = {pageNo: 1}
    window.config = {
      showToolbar: true,
      showPreviewBtn: true,
      autoOpenDetail: true,
      openTag: true,//给用户打标签
      clickPostItemOpenDetail: true,
      closePostDetailBySpace: true,//点击空白处关闭详情
      contentAutoCollapse: true,//正文超长自动折叠
      viewType: 'card',
      commentDisplayType: 0,
      newTabOpen: false,//新标签打开
      base64: true,//base功能
      sov2ex: false
    }
    window.isNight = $('.Night').length === 1
    window.cb = null
    window.postList = []
    window.parse = {
      //解析帖子内容
      async parsePostContent(post = {}, body, htmlText) {
        let once = htmlText.match(/var once = "([\d]+)";/)
        // console.log(once)
        if (once && once[1]) {
          post.once = once[1]
        }

        post.isReport = htmlText.includes('你已对本主题进行了报告')

        let topic_buttons = body.find('.topic_buttons')
        if (topic_buttons.length) {
          let favoriteNode = topic_buttons.find('.tb:first')
          if (favoriteNode.length) {
            post.isFavorite = favoriteNode[0].innerText === '取消收藏'
          }
          let ignoreNode = topic_buttons.find('.tb:nth-child(3)')
          if (ignoreNode.length) {
            post.isIgnore = ignoreNode[0].innerText === '取消忽略'
          }
          //
          let thankNode = topic_buttons.find('#topic_thank .tb')
          if (!thankNode.length) {
            post.isThanked = true
          }

          let topic_stats = topic_buttons.find('.topic_stats')
          //topic_stats = $(`<div class="fr topic_stats" style="padding-top: 4px;">9569 次点击 &nbsp;∙&nbsp; 28 人收藏 &nbsp; ∙&nbsp; 1 人感谢 &nbsp; </div>`)
          //收藏数、感谢数
          if (topic_stats.length) {
            let text = topic_stats[0].innerText
            let reg1 = text.matchAll(/([\d]+)[\s]*人收藏/g)
            let collectCountReg = [...reg1]
            if (collectCountReg.length) {
              post.collectCount = Number(collectCountReg[0][1])
            }
            // console.log([...collectCountReg])
            let reg2 = text.matchAll(/([\d]+)[\s]*人感谢/g)
            let thankCountReg = [...reg2]
            if (thankCountReg.length) {
              post.thankCount = Number(thankCountReg[0][1])
            }
            let reg3 = text.matchAll(/([\d]+)[\s]*次点击/g)
            let clickCountReg = [...reg3]
            if (clickCountReg.length) {
              post.clickCount = Number(clickCountReg[0][1])
            }
            // console.log([...thankCountReg])
          }
        }

        // console.log('基本信息', post)

        let header = body.find('#Main .box').first()
        let temp = header.clone()
        temp.find('.topic_buttons').remove()
        let html = temp.html()
        html = this.photoLink2Img(html)
        // console.log('html', html)
        post.headerTemplate = html
        return post
      },
      //获取帖子所有回复
      async getPostAllReplies(post = {}, body, htmlText, pageNo = 1) {
        if (body.find('#no-comments-yet').length) {
          return post
        }

        let box = body.find('#Main > .box')[1]
        let cells = box.querySelectorAll('.cell')
        post.fr = cells[0].querySelector('.cell .fr').innerHTML
        cells = Array.from(cells)

        //获取创建时间
        let snow = cells[0].querySelector('.snow')
        post.createDate = snow?.nextSibling.nodeValue.trim() || ''

        let repliesMap = []
        if (cells[1].id) {
          repliesMap.push({i: pageNo, replyList: this.parsePageReplies(cells.slice(1))})
          let replies = this.getAllReply(repliesMap)
          post.replies = replies
          post.replyCount = replies.length
          post.allReplyUsers = Array.from(new Set(replies.map(v => v.username)))
          let nestedList = this.createNestedList(replies, post.allReplyUsers)
          if (nestedList) post.nestedReplies = nestedList
          return post
        } else {
          let promiseList = []
          // console.log(this.current.repliesMap)
          return new Promise((resolve, reject) => {
            repliesMap.push({i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1))})

            let pages = cells[1].querySelectorAll('a')
            pages = Array.from(pages)
            // console.log(pages)
            let url = window.baseUrl + '/t/' + post.id
            for (let i = 0; i < pages.length; i++) {
              let currentPageNo = Number(pages[i].innerText)
              if (currentPageNo == pageNo) continue
              promiseList.push(this.fetchPostOtherPageReplies(url + '?p=' + currentPageNo, currentPageNo))
            }
            Promise.allSettled(promiseList).then(
              (results) => {
                results.filter((result) => result.status === "fulfilled").map(v => repliesMap.push(v.value))
                let replies = this.getAllReply(repliesMap)
                post.replies = replies
                post.replyCount = replies.length
                post.allReplyUsers = Array.from(new Set(replies.map(v => v.username)))
                let nestedList = this.createNestedList(replies, post.allReplyUsers)
                if (nestedList) post.nestedReplies = nestedList
                resolve(post)
              }
            );
          })
        }
      },
      //请求帖子其他页的回复
      fetchPostOtherPageReplies(url, pageNo) {
        return new Promise(resolve => {
          $.get(url).then(res => {
            let s = res.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
            let box = $(s[0]).find('#Main .box')[1]
            let cells = box.querySelectorAll('.cell')
            cells = Array.from(cells)
            resolve({i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1))})
          })
        })
      },
      //解析页面的回复
      parsePageReplies(nodes) {
        let replyList = []
        nodes.forEach((node, index) => {
          if (!node.id) return
          let item = {
            thankCount: 0,
            isThanked: false,
            isOp: false,
            id: node.id.replace('r_', '')
          }
          let reply_content = node.querySelector('.reply_content')
          // console.log('reply_content',reply_content)
          item.reply_content = reply_content.innerHTML
          item.reply_text = reply_content.innerText

          let {users, floor} = this.parseReplyContent(item.reply_content)
          item.replyUsers = users
          item.replyFloor = floor
          if (index === 5) {
            // console.log(item)
            // console.log(reply_content.innerText)
            // console.log(reply_content.innerHTML)
          }
          let ago = node.querySelector('.ago')
          item.date = ago.innerText

          let userNode = node.querySelector('strong a')
          item.username = userNode.innerText
          let avatar = node.querySelector('td img')
          item.avatar = avatar.src
          let no = node.querySelector('.no')
          item.floor = Number(no.innerText)

          let thank_area = node.querySelector('.thank_area')
          if (thank_area) {
            item.isThanked = thank_area.classList.contains('thanked')
          }
          let small = node.querySelector('.small')
          if (small) {
            item.thankCount = Number(small.innerText)
          }
          let op = node.querySelector('.op')
          if (op) {
            item.isOp = true
          }
          let mod = node.querySelector('.mod')
          if (mod) {
            item.isMod = true
          }
          // console.log('item', item)

          replyList.push(item)
        })
        return replyList
      },
      //解析回复内容，解析出@用户，回复楼层。用于后续生成嵌套楼层
      parseReplyContent(str) {
        if (!str) return
        let users = []
        let getUsername = (userStr) => {
          let endIndex = userStr.indexOf('">')
          if (endIndex > -1) {
            let user = userStr.substring(0, endIndex)
            if (!users.find(i => i === user)) {
              users.push(user)
            }
          }
        }
        // str = `@<a hr a> #4 @<a1 href="/member/Eiden1">Eiden1</a1>   @<a href="/member/Eiden111">Eiden21</a> #11   这也是执行阶段，所谓的安装也是程序业务的 setup 。<br>windows 、Android 并没有系统级的 CD-KEY 。`
        let userReg = /@<a href="\/member\/([\s\S]+?)<\/a>/g
        let has = str.matchAll(userReg)
        let res2 = [...has]
        // console.log('总匹配', res2)
        if (res2.length > 1) {
          res2.map(item => {
            getUsername(item[1])
          })
        }
        if (res2.length === 1) {
          getUsername(res2[0][1])
        }
        // console.log('用户', users)
        // console.log('楼层', floor)
        let floor = -1
        //只有@一个人的时候才去查找是否指定楼层号。
        if (users.length === 1) {
          let floorReg = /@<a href="\/member\/[\s\S]+?<\/a>[\s]+#([\d]+)/g
          let hasFloor = str.matchAll(floorReg)
          let res = [...hasFloor]
          // console.log('总匹配', res)
          if (res.length) {
            floor = Number(res[0][1])
          }
        }
        return {users, floor}
      },
      //获取帖子详情
      async getPostDetail(post = {}, body, htmlText, pageNo = 1) {
        post = await this.parsePostContent(post, body, htmlText)
        return await this.getPostAllReplies(post, body, htmlText, pageNo)
      },
      getAllReply(repliesMap = []) {
        return repliesMap.sort((a, b) => a.i - b.i).reduce((pre, i) => {
          pre = pre.concat(i.replyList)
          return pre
        }, [])
      },
      //生成嵌套回复
      createNestedList(allList = []) {
        if (!allList.length) return []
        if ((Date.now() - window.win().lastCallDate) < 1000) {
          // console.log('短时间内，重复调用,因为监听了replies,所以打开时会触发两次。第二次不管他')
          return false
        }
        // console.log('cal-createNestedList', Date.now())

        let list = JSON.parse(JSON.stringify(allList))
        let nestedList = []
        list.map((item, index) => {
          let startList = list.slice(0, index)
          //用于918489这种情况，@不存在的人
          let startReplyUsers = Array.from(new Set(startList.map(v => v.username)))

          let endList = list.slice(index + 1)

          item.level = 0
          if (index === 0) {
            nestedList.push(this.findChildren(item, endList, list))
          } else {
            if (!item.isUse) {
              //是否是一级回复
              let isOneLevelReply = false
              if (item.replyUsers.length) {
                if (item.replyUsers.length > 1) {
                  isOneLevelReply = true
                } else {
                  isOneLevelReply = !startReplyUsers.find(v => v === item.replyUsers[0]);
                }
              } else {
                isOneLevelReply = true
              }
              if (isOneLevelReply) {
                item.level === 0
                nestedList.push(this.findChildren(item, endList, list))
              }
            }
          }
        })
        // console.log('replies长度', allList)
        // console.log('nestedList长度', nestedList)
        window.win().lastCallDate = Date.now()
        return nestedList
      },
      //查找子回复
      findChildren(item, endList, all) {
        const fn = (child, endList2, parent,) => {
          child.level = parent.level + 1
          let rIndex = all.findIndex(v => v.floor === child.floor)
          if (rIndex > -1) {
            all[rIndex].isUse = true
          }
          parent.children.push(this.findChildren(child, endList2, all,))
        }
        // console.log('endList', endList)
        item.children = []
        // if (item.floor === 46) debugger
        let floorReplyList = []

        //先找到指定楼层的回复，再去循环查找子回复
        //原因：问题930155，有图
        for (let i = 0; i < endList.length; i++) {
          let currentItem = endList[i]
          //如果已被使用，直接跳过
          if (currentItem.isUse) continue
          if (currentItem.replyFloor === item.floor) {
            //必须楼层对应的名字和@人的名字相同。因为经常出现不相同的情况
            if (currentItem.replyUsers.length === 1 && currentItem.replyUsers[0] === item.username) {
              //先标记为使用，不然遇到“问题930155”，会出现重复回复
              currentItem.isUse = true
              floorReplyList.push({endList: endList.slice(i + 1), currentItem})
              //问题930155：这里不能直接找子级，如果item为A，currentItem为B，但随后A又回复了B，然后C回复A。这样直接找子级就会把C归类到B的子回复，而不是直接A的子回复
              //截图：930155.png
              // fn(currentItem, endList.slice(i + 1), item)
            } else {
              currentItem.isWrong = true
            }
          }
        }
        //从后往前找
        //原因：问题933080，有图
        floorReplyList.reverse().map(({currentItem, endList}) => {
          fn(currentItem, endList, item)
        })

        //下一个我的下标，如果有下一个我，那么当前item的子回复应在当前和下个我的区间内查找
        let nextMeIndex = endList.findIndex(v => {
          //必须是下一个不是”自己回复自己“的自己
          //原因：问题887644（1-2），有图
          return (v.username === item.username) && (v.replyUsers?.[0] !== item.username)
        })
        let findList = nextMeIndex > -1 ? endList.slice(0, nextMeIndex) : endList

        for (let i = 0; i < findList.length; i++) {
          let currentItem = findList[i]
          //如果已被使用，直接跳过
          if (currentItem.isUse) continue
          if (currentItem.replyUsers.length === 1) {
            //如果这条数据指定了楼层，并且名字也能匹配上，那么直接忽略
            //原因：问题887644-3，有图
            if (currentItem.replyFloor !== -1) {
              if (all[currentItem.replyFloor].username === currentItem.username) {
                continue
              }
            }
            let endList2 = endList.slice(i + 1)
            //如果是下一条是同一人的回复，那么跳出循环
            if (currentItem.username === item.username) {
              //自己回复自己的特殊情况
              if (currentItem.replyUsers[0] === item.username) {
                fn(currentItem, endList2, item)
              }
              break
            } else {
              if (currentItem.replyUsers[0] === item.username) {
                fn(currentItem, endList2, item)
              }
            }
          } else {
            //下一条是同一人的回复，并且均未@人。直接跳过
            if (currentItem.username === item.username) break
          }
        }

        //排序，因为指定楼层时，是从后往前找的
        item.children = item.children.sort((a, b) => a.floor - b.floor)
        return item
      },
      //解析页面帖子列表
      parsePagePostList(list, box) {
        list.forEach(itemDom => {
          let item = window.clone(window.initPost)
          let item_title = itemDom.querySelector('.item_title a')
          let {href, id} = window.parse.parseA(item_title)
          item.id = id
          item.href = href
          item.url = window.win().location.origin + '/api/topics/show.json?id=' + item.id
          itemDom.classList.add('post-item')
          itemDom.classList.add(`id_${id}`)
          itemDom.dataset['href'] = href
          itemDom.dataset['id'] = id
          window.postList.push(item)
        })


        Promise.allSettled(window.postList.map(item => $.get(item.url))).then(res => {
          let ok = res.filter((r) => r.status === "fulfilled").map(v => v.value[0])
          // let fail = res.filter((r) => r.status === "rejected")
          box.style.boxShadow = 'unset'
          box.style.background = 'unset'
          if (window.config.viewType === 'card') {
            list.forEach(itemDom => {
              itemDom.classList.add('preview')
            })
          }
          ok.map(postItem => {
            if (postItem?.id) {
              let itemDom = box.querySelector(`.id_${postItem.id}`)

              if (window.config.showPreviewBtn) {
                //添加切换按钮
                let td = itemDom.querySelector('td:nth-child(4)')
                td.style.position = 'relative'
                let toggle = document.createElement('div')
                toggle.dataset['id'] = postItem.id
                toggle.classList.add('toggle')
                toggle.innerText = '点击展开/收起'
                td.append(toggle)
              }

              let index = window.postList.findIndex(v => v.id == postItem.id)
              if (index > -1) {
                let obj = window.postList[index]
                window.postList[index] = Object.assign({}, obj, postItem)

                if (postItem.content_rendered) {
                  let a = document.createElement('a')
                  a.href = obj.href
                  a.classList.add('post-content')
                  let div = document.createElement('div')
                  div.innerHTML = postItem.content_rendered
                  a.append(div)
                  // console.log(div.clientHeight)
                  itemDom.append(a)
                }
              }
            }
          })
          cbChecker({type: 'syncData'})
        })
      },
      parseA(a) {
        let href = a.href
        let id
        if (href.includes('/t/')) {
          if (href.includes('#')) {
            id = href.substring(href.indexOf('/t/') + 3, href.indexOf('#'))
          } else {
            id = href.substring(href.indexOf('/t/') + 3,)
          }
        }
        return {href, id, title: a.innerText}
      },
      //创建记事本里面的tag标签
      async createTagNote() {
        let data = new FormData()
        data.append('content', '--用户标签--')
        data.append('parent_id', 0)
        data.append('syntax', 0)
        let apiRes = await window.win().fetch(`${window.baseUrl}/notes/new`, {method: 'post', body: data})
        console.log(apiRes)
        if (apiRes.redirected && apiRes.status === 200) {
          //成功
          return apiRes.url.substr(-5)
        }
        return null
      },
      //标签操作
      async saveTags(val) {
        let data = new FormData()
        data.append('content', window.user.tagPrefix + JSON.stringify(val))
        data.append('syntax', 0)
        let apiRes = await window.win().fetch(`${window.baseUrl}/notes/edit/${window.user.tagsId}`, {
          method: 'post', body: data
        })
        return apiRes.redirected && apiRes.status === 200;
      },
      //图片链接转Img标签
      photoLink2Img(str) {
        let imgWebs = [
          /<a href="https?:\/\/[^<a]*imgur.com[^<a]*>([\s\S]*?)<\/a>/g,
        ]
        imgWebs.map(v => {
          str = str.replace(v, '<img src="$1.png" alt="">')
        })
        return str
      }
    }

    async function sleep(time) {
      return new Promise(resolve => {
        // console.log('等待vue加载完成,第' + count + '次', Date.now())
        setTimeout(resolve, time)
      })
    }

    async function cbChecker(val, count = 0) {
      if (window.cb) {
        window.cb(val)
      } else {
        while ((!window.cb) && count < 20) {
          await sleep(500)
          count++
        }
        window.cb && window.cb(val)
      }
    }

    function feedback() {
      window.GM_openInTab('https://github.com/zyronon/v2ex-script/discussions/', {
        active: true,
        insert: true,
        setParent: true
      });
    }

    //初始化脚本菜单
    function initMonkeyMenu() {
      try {
        window.GM_registerMenuCommand("脚本设置", function (event) {
          cbChecker({type: 'openSetting'})
        });
        window.GM_registerMenuCommand('💬 反馈 & 建议', feedback);
      } catch (e) {
        console.error('无法使用Tampermonkey')
      }
    }

    //初始化样式表
    function initStyle() {
      //给Wrapper和content取消宽高，是因为好像是v2的屏蔽机制，时不时会v2会修复这两个div的宽高，让网页变形
      let style2 = `
     html, body {
          font-size: 62.5%;
      }

        #Wrapper {
          height: unset !important;
          width: unset !important;
        }

         #Wrapper > .content {
          height: unset !important;
          width: unset !important;
        }


      .post-item {
          background: white;
      }

      .post-item > .post-content {
          height: 0;
          margin-top: 0;
      }

      .post-item:hover .toggle {
          display: flex;
      }

      .toggle {
          position: absolute;
          right: 0;
          top: 0.5rem;
          width: 9rem;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          cursor: pointer;
          font-size: 1.2rem;
          color: #ccc;
          display: none;
      }

      .preview {
          margin: 1rem 0;
          border: 1px solid #e2e2e2;
          border-radius: 0.4rem;
          cursor: pointer;
      }

      .preview:hover {
          border: 1px solid #968b8b;
      }

      .preview > .post-content {
          height: unset !important;
          margin-top: 0.5rem !important;
      }

      .preview  .topic-link:link {
          color: black !important;
      }

      .post-content {
          margin-top: 0.5rem;
          display: block;
          max-height: 20rem;
          overflow: hidden;
          text-decoration: unset !important;
          line-break: anywhere;
      }

      .post-content:link {
          color: #494949;
      }


      .post-content:visited {
          color: #afb9c1 !important;
      }

      .Night .post-item {
          background: #18222d !important;
      }

      .Night .preview {
          border: 1px solid #3b536e;
      }

      .Night .preview > .post-content:link {
          color: #d1d5d9;
      }

      .Night .preview > .post-content:visited {
          color: #393f4e !important;
      }

      .Night .preview  .topic-link:link {
          color: #c0dbff !important;
      }

    `
      let addStyle2 = document.createElement("style");
      addStyle2.rel = "stylesheet";
      addStyle2.type = "text/css";
      addStyle2.innerHTML = style2
      $(window.win().doc.head).append(addStyle2)
    }

    // 自动签到（后台）
    function qianDao() {
      let timeNow = new Date().getUTCFullYear() + '/' + (new Date().getUTCMonth() + 1) + '/' + new Date().getUTCDate() // 当前 UTC-0 时间（V2EX 按这个时间的）
      // return qianDao_(null, timeNow); //                           后台签到
      if (window.pageType === 'home') { //                               在首页
        let qiandao = window.query('.box .inner a[href="/mission/daily"]');
        if (qiandao) { //                                            如果找到了签到提示
          qianDao_(qiandao, timeNow); //                           后台签到
        } else if (window.win().doc.getElementById('gift_v2excellent')) { // 兼容 [V2ex Plus] 扩展
          window.win().doc.getElementById('gift_v2excellent').click();
          localStorage.setItem('menu_clockInTime', timeNow); //             写入签到时间以供后续比较
          console.info('[V2EX - 超级增强] 自动签到完成！')
        } else { //                                                  都没有找到，说明已经签过到了
          console.info('[V2EX - 超级增强] 自动签到完成！')
        }
      } else { //                                                      不在首页
        let timeOld = localStorage.getItem('menu_clockInTime')
        if (!timeOld || timeOld != timeNow) {
          qianDaoStatus_(timeNow) //                               后台获取签到状态（并判断是否需要签到）
        } else { //                                                新旧签到时间一致
          console.info('[V2EX - 超级增强] 自动签到完成！')
        }
      }
    }

    // 后台签到
    function qianDao_(qiandao, timeNow) {
      // let url = window.baseUrl + "/mission/daily"
      let url = (window.baseUrl + "/mission/daily/redeem?" + RegExp("once\\=(\\d+)").exec(document.querySelector('div#Top .tools, #menu-body').innerHTML)[0]);
      console.log('url', url)
      $.get(url).then(r => {
        let bodyText = r.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
        let html = $(bodyText[0])
        if (html.find('li.fa.fa-ok-sign').length) {
          html = html.find('#Main').text().match(/已连续登录 (\d+?) 天/)[0];
          localStorage.setItem('menu_clockInTime', timeNow); // 写入签到时间以供后续比较
          console.info('[V2EX - 超级增强] 自动签到完成！')
          if (qiandao) {
            qiandao.textContent = `自动签到完成！${html}`;
            qiandao.href = 'javascript:void(0);';
          }
        } else {
          window.GM_notification({
            text: '自动签到失败！请访问 V2EX 首页试试。\n如果连续几天都签到失败，请联系作者解决！',
            timeout: 4000,
            onclick() {
              feedback()
            }
          });
          console.warn('[V2EX 增强] 自动签到失败！请访问 V2EX 首页试试。如果连续几天都签到失败，请联系作者解决！')
          if (qiandao) qiandao.textContent = '自动签到失败！请尝试手动签到！';
        }
      })
    }

    // 后台获取签到状态（并判断是否需要签到）
    function qianDaoStatus_(timeNow) {
      $.get(window.baseUrl + '/mission/daily').then(r => {
        let bodyText = r.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
        let html = $(bodyText[0])
        if (html.find('input[value^="领取"]').length) { //     还没有签到...
          qianDao_(null, timeNow); //                          后台签到
        } else { //                                              已经签到了...
          console.info('[V2EX 增强] 已经签过到了。')
          localStorage.setItem('menu_clockInTime', timeNow); //         写入签到时间以供后续比较
        }
      })
    }

    function checkPageType() {
      let location2 = window.win().location
      if (location2.pathname === '/') {
        window.pageType = 'home'
      } else if (location2.href.match(/.com\/?tab=/)) {
        window.pageType = 'home'
      } else if (location2.href.match(/.com\/go\//)) {
        if (!location2.href.includes('/links')) {
          window.pageType = 'nodePage'
        }
      } else if (location2.href.match(/.com\/recent/)) {
        window.pageType = 'recent'
      } else {
        let r = location2.href.match(/.com\/t\/([\d]+)/)
        if (r) {
          window.pageType = 'post'
          window.pageData.id = r[1]
          if (location2.search) {
            let pr = location2.href.match(/\?p=([\d]+)/)
            if (pr) window.pageData.pageNo = Number(pr[1])
          }
        }
      }
    }

    //初始化标签的记事本数据
    function initTagNoteData() {
      //获取或创建记事本的标签
      $.get(window.baseUrl + '/notes').then(r => {
        let bodyText = r.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
        let body = $(bodyText[0])
        let items = body.find('#Main .box .note_item_title a')
        let needCreateNoteTags = true
        if (items.length) {
          let tags = Array.from(items).find(v => v.innerText.includes(window.user.tagPrefix))
          if (tags) {
            needCreateNoteTags = false
            window.user.tagsId = tags.href.substr(-5)
            cbChecker({type: 'syncData'})
            $.get(window.baseUrl + '/notes/edit/' + window.user.tagsId).then(r2 => {
              bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g)
              body = $(bodyText[0])
              let text = body.find('.note_editor').text()
              if (text === window.user.tagPrefix) {
                window.user.tags = {}
              } else {
                let tagJson = text.substring(window.user.tagPrefix.length)
                try {
                  window.user.tags = JSON.parse(tagJson)
                } catch (e) {
                  console.log('tage', tagJson)
                  window.user.tags = {}
                }
              }
              cbChecker({type: 'syncData'})
            })
          }
        }
        if (needCreateNoteTags) {
          window.parse.createTagNote().then(r => {
            if (r) {
              window.user.tagsId = r
              window.user.tags = {}
              cbChecker({type: 'syncData'})
            }
          })
        }
      })
    }

    function initConfig() {
      return new Promise(resolve => {
        //获取默认配置
        let configStr = window.win().localStorage.getItem('v2ex-config')
        if (configStr) {
          let configObj = JSON.parse(configStr)
          configObj = configObj[window.user.username ?? 'default']
          if (configObj) {
            window.config = Object.assign(window.config, configObj)
          }
        }
        resolve(window.config)
      })
    }

    // 替换为 sov2ex 搜索，代码来自 v2ex-plus 扩展：https://github.com/sciooga/v2ex-plus （懒得重复造轮子了~）
    function initSoV2ex() {
      var $search = $('#search')
      var searchEvents = $._data($search[0], "events")
      console.log($search, searchEvents)
      var oKeydownEvent = searchEvents['keydown'][0]['handler']
      var oInputEvent = searchEvents['input'][0]['handler']
      $search.attr("placeholder", "sov2ex")
      $search.unbind('keydown', oKeydownEvent)
      $search.unbind('input', oInputEvent)
      $search.on('input', function (e) {
        oInputEvent(e)
        $('.search-item:last').attr('href', 'https://www.sov2ex.com/?q=' + $search.val()).text('sov2ex ' + $search.val());
      })
      $search.keydown(function (e) {
        if (e.code == 'Enter' || e.code == 'NumpadEnter' || e.keyCode === 13) {
          if ($('.search-item:last').is('.active')) {
            $(this).val($(this).val().replace(/[#%&]/g, ""));//用户输入不能包含特殊字符#%&
            window.open("https://www.sov2ex.com/?q=" + $(this).val());
            return 0
          }
        }
        oKeydownEvent(e)
      })
    }

    window.win().canParseV2exPage = true
    if (window.win().canParseV2exPage) {
      checkPageType()
      initMonkeyMenu()
      initStyle()

      let top2 = window.win().query('.tools .top:nth-child(2)').text
      if (top2 !== '注册') {
        window.user.username = top2
        window.user.avatar = $('#Rightbar .box .avatar', window.win().doc).attr('src')
        cbChecker({type: 'syncData'})

        initTagNoteData()
        try {
          qianDao()
        } catch (e) {
        }
      }

      initConfig().then(r => {
        if (window.config.sov2ex) {
          setTimeout(initSoV2ex, 1000)
        }
        if (window.config.newTabOpen) {
          window.win().doc.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
        }
      })

      let $section = document.createElement('section')
      $section.id = 'app'

      let box
      let list
      switch (window.pageType) {
        case 'nodePage':
          box = window.win().doc.querySelectorAll('#Wrapper #Main .box')

          let topics = box[1].querySelector('#TopicsNode')
          list = topics.querySelectorAll('.cell')
          list[0].before($section)
          window.parse.parsePagePostList(list, box[1])
          break
        case 'recent':
        case 'home':
          box = window.win().query('#Wrapper #Main .box')
          list = box.querySelectorAll('.item')
          list[0].before($section)
          window.parse.parsePagePostList(list, box)
          break
        case 'post':
          box = window.win().query('#Wrapper #Main .box')
          box.after($section)
          window.parse.parsePostContent(
            {id: window.pageData.id},
            $(window.win().doc.body),
            window.win().doc.documentElement.outerHTML
          ).then(async res => {
            // console.log('详情页-基本信息解析完成', new Date())
            window.pageData.post = res
            await cbChecker({type: 'postContent', value: res}, 0)
          })

          window.parse.getPostAllReplies(
            {id: window.pageData.id},
            $(window.win().doc.body),
            window.win().doc.documentElement.outerHTML,
            window.pageData.pageNo
          ).then(async res => {
            // console.log('详情页-回复解析完成', new Date())
            window.pageData.post = Object.assign(window.pageData.post, res)
            await cbChecker({type: 'postReplies', value: res}, 0)
          })
          break
        default:
          console.error('未知页面')
          break
      }
    }
  }

})();