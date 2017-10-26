const postRoutes = ['index', 'posts', 'posts.index', 'posts.post'];

export default function(){
  this.transition(
    this.fromRoute(postRoutes),
    this.toRoute(postRoutes),
    this.use('explode', {
      matchBy: 'data-post-id',
      use: ['fly-to', {duration: 150, easing: 'easeOut'}]
    }),
    this.debug()
  );
}
