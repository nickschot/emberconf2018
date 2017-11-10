import breakpoints from './breakpoints';

const postRoutes = ['posts', 'posts.index'];

const slideDuration = 250;

export default function(){
  this.transition(
    this.fromRoute(true),
    this.toRoute(true),
    this.media(breakpoints.mobile),
    this.use('explode',/*{
      matchBy: 'data-page-image-id',
      use: ['flyToOverlay', {duration: slideDuration}]
    },*/{
      pickNew: '.btn-back',
      use: ['wait', slideDuration, { then: 'fade' }, { duration: slideDuration }]
    },{
      use: ['slideOverLeft', {duration: slideDuration}]
    })
  );

  this.transition(
    this.fromRoute('posts.post'),
    this.toRoute(['posts', 'posts.index']),
    this.media(breakpoints.mobile),
    this.use('explode',/*{
      matchBy: 'data-page-image-id',
      use: ['flyToOverlay', {duration: slideDuration}]
    },*/{
      use: ['slideUnderRight', {duration: slideDuration}]
    })
  );

  this.transition(
    this.fromRoute(true),
    this.toRoute('index'),
    this.media(breakpoints.mobile),
    this.use('fade', {duration: 200})
  );

  /*this.transition(
    this.fromRoute(postRoutes),
    this.toRoute('posts.post'),
    this.use('explode', {
      matchBy: 'data-post-id',
      use: ['fly-to', {duration: 150, easing: 'easeOut'}]
    })
  );*/
}
