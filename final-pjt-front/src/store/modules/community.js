import axios from 'axios'
import drf from '@/api/drf'
import router from '@/router'

import _ from 'lodash'

export default {
  state: {
    articles: [],
    // articles2: [],
    article: {},
  },

  getters: {
    articles: state => state.articles,
    // articles2: state => state.articles2,
    article: state => state.article,
    isAuthor: (state, getters) => {
      return state.article.user?.username === getters.currentUser.username
    },
    isArticle: state => !_.isEmpty(state.article),
  },

  mutations: {
    SET_ARTICLES: (state, articles) => state.articles = articles,
    // SET_ARTICLES2: (state, articles2) => state.articles2 = articles2,
    SET_ARTICLE: (state, article) => state.article = article,
    SET_ARTICLE_COMMENTS: (state, comments) => (state.article.comments = comments),
  },

  actions: {
    fetchArticles({ commit, getters }) {
      axios({
        url: drf.community.articles(),
        method: 'get',
        headers: getters.authHeader,
      })
        .then(res => commit('SET_ARTICLES', res.data))
        .catch(err => console.error(err.response))
    },

    // paginator
    // async fetchArticlePage({ commit, getters }, pageNum) {
    //   await axios({
    //     url:drf.community.articlePage(pageNum),
    //     method: 'get',
    //     headers: getters.authHeader,
    //   })
    //     .then(res => {
    //       commit('SET_ARTICLES2', [])
    //       console.log(res.data)
    //       console.log(drf.community.articlePage(pageNum))
    //       commit('SET_ARTICLES2', res.data)
    //     })
    //     .catch(err => console.error(err))
    // },

    fetchArticle({ commit, getters }, articlePk) {
      axios({
        url: drf.community.article(articlePk),
        method: 'get',
        headers: getters.authHeader,
      })
        .then(res => commit('SET_ARTICLE', res.data))
        .catch(err => {
          console.error(err.response)
          if (err.response.status === 404) {
            router.push({ name: 'NotFound404' })
          }
        })
    },

    createArticle({ commit, getters }, article) { 
      axios({
        url: drf.community.articles(),
        method: 'post',
        data: article,
        headers: getters.authHeader,
      })
        .then(res => {
          // console.log(res.data)
          commit('SET_ARTICLE', res.data)
          router.push({
            name: 'articleDetail',
            params: { articlePk: getters.article.pk }
          })
        })
    },

    updateArticle({ commit, getters }, { pk, title, content}) {
      axios({
        url: drf.community.article(pk),
        method: 'put',
        data: { title, content },
        headers: getters.authHeader,
      })
        .then(res => {
          commit('SET_ARTICLE', res.data)
          router.push({
            name: 'articleDetail',
            params: { articlePk: getters.article.pk }
          })
        })
    },

    deleteArticle({ commit, getters }, articlePk) {
      if (confirm('?????? ?????????????????????????')) {
        axios({
          url: drf.community.article(articlePk),
          method: 'delete',
          headers: getters.authHeader,
        })
          .then(() => {
            commit('SET_ARTICLE', {})
            router.push({ name: 'community' })
          })
          .catch(err => console.error(err.response))
      }
    },

    likeArticle({ commit, getters }, articlePk) {
      axios({
        url: drf.community.likeArticle(articlePk),
        method: 'post',
        headers: getters.authHeader,
      })
        .then(res => commit('SET_ARTICLE', res.data))
        .catch(err => console.error(err.response))
    },

		createComment({ commit, getters }, { articlePk, content }) {
      const comment = { content }

      axios({
        url: drf.community.comments(articlePk),
        method: 'post',
        data: comment,
        headers: getters.authHeader,
      })
        .then(res => {
          commit('SET_ARTICLE_COMMENTS', res.data)
        })
        .catch(err => console.error(err.response))
    },

    updateComment({ commit, getters }, { articlePk, commentPk, content }) {
      const comment = { content }

      axios({
        url: drf.community.comment(articlePk, commentPk),
        method: 'put',
        data: comment,
        headers: getters.authHeader,
      })
        .then(res => {
          commit('SET_ARTICLE_COMMENTS', res.data)
        })
        .catch(err => console.error(err.response))
    },

    deleteComment({ commit, getters }, { articlePk, commentPk }) {
      if (confirm('?????? ?????????????????????????')) {
        axios({
          url: drf.community.comment(articlePk, commentPk),
          method: 'delete',
          data: {},
          headers: getters.authHeader,
        })
          .then(res => {
            commit('SET_ARTICLE_COMMENTS', res.data)
          })
          .catch(err => console.error(err.response))
      }
    },

    addArticleView({ getters }, articlePk) {
      axios({
        url: drf.community.views(articlePk),
        method: 'post',
        headers: getters.authHeader
      })
        // .then(res => {
        //   console.log(res.data)
        // })
        .catch(err => console.error(err.response))
    },
  },
}
