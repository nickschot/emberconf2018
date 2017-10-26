export default function(){
  this.transition(
    this.fromRoute('posts.index'),
    this.toRoute('posts.post'),
    this.use('explode', {
      matchBy: 'data-post-id',
      use: ['fly-to', {duration: 200, easing: 'easeOut'}]
    }),
    this.reverse('explode', {
      matchBy: 'data-post-id',
      use: ['fly-to', {duration: 200, easing: 'easeOut'}]
    })
  );
}
