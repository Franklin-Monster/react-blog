import React from 'react'
import Head from 'next/head'
import { Row, Col, Breadcrumb, Affix } from 'antd'
import Header from '../components/Header'
import Author from '../components/Author'
import Advert from '../components/Advert'
import Footer from '../components/Footer'
import '../public/style/pages/detail.css'
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'
import axios from 'axios'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import Tocify from '../components/tocify.tsx'
import servicePath from '../config/apiUrl'
import moment from 'moment'
import {
    CalendarOutlined,
    FolderOutlined,
    FireOutlined
} from '@ant-design/icons';
const Detail = (props) => {
    const tocify = new Tocify()
    const renderer = new marked.Renderer();
    renderer.heading = function (text, level, raw) {
        const anchor = tocify.add(text, level)
        return `<a id="${anchor}" href="#${anchor}" class="anchor-fix><h${level}>${text}</h${level}></a>\n`
    }
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });


    return (
        <>
            <Head>
                <title>博客详细页</title>
            </Head>
            <Header />
            <Row className="comm-main" type="flex" justify="center">
                <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}  >
                    <div>
                        <div className="bread-div">
                            <Breadcrumb>
                                <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
                                <Breadcrumb.Item>视频列表</Breadcrumb.Item>
                                <Breadcrumb.Item>xxxx</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        <div>
                            <div className="detailed-title" dangerouslySetInnerHTML={{ __html:marked(props.title) }}>
                             
                    </div>

                            <div className="list-icon center">
                                <span dangerouslySetInnerHTML={{ __html:(props.add_time).split(' ')[0]}}></span>
                                <span dangerouslySetInnerHTML={{ __html:marked((props.view_count).toString()+ '人')}}></span>                             
                            </div>

                            <div className="detailed-content"
                                dangerouslySetInnerHTML={{ __html:marked(props.article_content)}}>

                            </div>

                        </div>

                    </div>
                </Col>

                <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
                    <Author />
                    <Advert />
                    <Affix offsetTop={5}>
                        <div className="detailed-nav comm-box">
                            <div className="nav-title">文章目录</div>
                            {tocify && tocify.render()}
                        </div>
                    </Affix>
                </Col>
            </Row>
            <Footer />

        </>
    )
}
Detail.getInitialProps = async (context) => {
    let id = context.query.id
    const promise = new Promise((resolve) => {
        axios(servicePath.getArticleById + id).then(res => {
    
            resolve(res.data.data[0])
        })
    })
    return await promise
}
export default Detail



 