'use strict'

const Controller = require('egg').Controller

class MainController extends Controller {
    async index() {
        this.ctx.body = 'hi api'
    }
    async checkLogin() {
        let username = this.ctx.request.body.userName
        let password = this.ctx.request.body.password
        const sql = "SELECT userName FROM admin_user WHERE userName='" + username + "' AND password = '" + password + "'"
        const res = await this.app.mysql.query(sql)
        if (res.length > 0) {
            //登录成功,进行session缓存
            let openId = new Date().getTime()
            this.ctx.session.openId = { 'openId': openId }
            this.ctx.body = { 'data': '登录成功', 'openId': openId }

        } else {
            this.ctx.body = { data: '登录失败' }
        }
    }
    //后台文章分类信息
    async getTypeInfo() {
        const resType = await this.app.mysql.select('type')
        this.ctx.body = { data: resType }
    }

    //添加文章
    async addArticle() {
        let tmpArticle = this.ctx.request.body
        const result = await this.app.mysql.insert('article', tmpArticle)
        const insertSuccess = result.affectedRows === 1
        const insertId = result.insertId
        this.ctx.body = {
            isSuccess: insertSuccess,
            insertId: insertId
        }
    }

    //修改文章
    async updateArticle() {
        let tmpArticle = this.ctx.request.body
        const result = await this.app.mysql.update('article', tmpArticle);
        const updateSuccess = result.affectedRows === 1;
        this.ctx.body = {
            isScuccess: updateSuccess
        }
    }
    //获得文章列表
    async getArticleList() {

        let sql = 'SELECT article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.add_time,'%Y-%m-%d' ) as add_time," +
            'type.typeName as typeName ' +
            'FROM article LEFT JOIN type ON article.type_id = type.typeId ' +
            'ORDER BY article.id DESC '

        const resList = await this.app.mysql.query(sql)
        this.ctx.body = { list: resList }

    }

    //删除文章
    async delArticle() {
        let id = this.ctx.params.id
        const res = await this.app.mysql.delete('article', { 'id': id })
        this.ctx.body = { data: res }
    }

    //根据文章ID得到文章详情，用于修改文章
    async getArticleById() {
        let id = this.ctx.params.id
        let sql = 'SELECT article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            'article.article_content as article_content,' +
            "FROM_UNIXTIME(article.add_time,'%Y-%m-%d' ) as add_time," +
            'article.view_count as view_count ,' +
            'type.typeName as typeName ,' +
            'type.typeId as typeId ' +
            'FROM article LEFT JOIN type ON article.type_id = type.typeId ' +
            'WHERE article.id=' + id
        const result = await this.app.mysql.query(sql)
        this.ctx.body = { data: result }
    }

}
module.exports = MainController