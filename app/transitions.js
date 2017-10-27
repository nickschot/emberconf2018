import breakpoints from './breakpoints';

const postRoutes = ['posts', 'posts.index'];

export default function(){
  this.transition(
    this.fromRoute(true),
    this.toRoute(true),
    this.media(breakpoints.mobile),
    this.use('slideOverLeft', {duration: 300})
  );

  this.transition(
    this.fromRoute('posts.post'),
    this.toRoute(['posts', 'posts.index']),
    this.media(breakpoints.mobile),
    this.use('slideUnderRight', {duration: 300})
  );

  this.transition(
    this.fromRoute(true),
    this.toRoute('index'),
    this.media(breakpoints.mobile),
    this.use('fade', {duration: 300})
  )

  /*this.transition(
    this.fromRoute(postRoutes),
    this.toRoute('posts.post'),
    this.use('explode', {
      matchBy: 'data-post-id',
      use: ['fly-to', {duration: 150, easing: 'easeOut'}]
    })
  );*/
}
