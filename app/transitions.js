const postRoutes = ['posts', 'posts.index'];

export default function(){
  this.transition(
    this.fromRoute(postRoutes),
    this.toRoute('posts.post'),
    this.use('explode', {
      matchBy: 'data-post-id',
      use: ['fly-to', {duration: 150, easing: 'easeOut'}]
    })
  );
}
