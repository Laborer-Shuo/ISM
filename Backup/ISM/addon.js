$(document).ready(function () {
    let timer = setInterval(function () {
        let loginStr = "\u767B\u5F55";    /*登录*/
        let projStr = "\u9879\u76EE";     /*项目*/
        let startStr = "\u667A\u80FD";    /*智能*/

        let title = $("title").text();

        if (title.indexOf(startStr) == 0) {
            if (title.indexOf(loginStr) > 0) {
                inLoginPage();
            } else if (title.indexOf(projStr) > 0) {
                inProjectPage();
            } else {
                inUserPage();
            }
        }
    }, 500);
})

function inLoginPage() {
    let loginStr = "\u767B\u5F55";             /*登录*/
    let langStr = "\u7B80\u4F53\u4E2D\u6587";  /*简体中文 */

    let eLogin = $("h2:contains(" + loginStr + ")");
    if (eLogin.length > 0) {
        eLogin.text("");

        let mid1 = $(".middle1").first();
        let mid1H = mid1.height();
        let imgH = 200;

        if (mid1H < 500) {
            imgH = 128;
        } else {
            imgH = 200;
        }

        let img = eLogin.parent().children(":first-child").children(":first-child");
        img.width(imgH);
        img.height(imgH);
    }

    //let eLang = $("a:contains(" + langStr + ")");
    //if (eLang.length > 0) {
    //    eLang.parent().parent().parent().parent().remove();
    //}

    $(window).resize(function () {
        location.reload();
    });
}

function inProjectPage() {

}

function inUserPage() {
    let dbManage = "\u6570\u636E\u5E93\u7BA1\u7406";      /*数据库管理 */
    let superUser = "\u8D85\u7EA7\u7BA1\u7406\u5458";     /*超级管理员*/
    let helpStr = "\u5E2E\u52A9";                         /*帮助 */

    let account = $("span:contains(" + superUser + ")");
    if (account.length > 0) {
        return true;
    } else {
        let menuDbManage = $("a:contains(" + dbManage + ")");
        if (menuDbManage.length > 0) {
            menuDbManage.first().parent().remove();
        }
        let menuHelp = $("a:contains(" + helpStr + ")");
        if (menuHelp.length > 0) {
            menuHelp.first().remove();
        }

        return false;
    }
}