import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPost } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: IPost[] = [];
  private postsUpdated = new Subject<{posts: IPost[], postsCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: Number, ) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    return this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        }), maxPosts:postData.maxPosts}
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount:transformedPostsData.maxPosts
        });
      })
  };

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
      "http://localhost:3000/api/posts/" + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: IPost = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    return this.http.post<{ message: string, post: IPost }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {

        this.router.navigate(["/"]);
      });
  };

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: IPost | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    };
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        /* const udatedPosts = [...this.posts];
        const oldPostIndex = udatedPosts.findIndex(p => p.id === id);
        const post: IPost = {
          id: id,
          title: title,
          content: content,
          imagePath: "response.imagePath"
        };
        udatedPosts[oldPostIndex] = post;
        this.posts = udatedPosts;
        this.postsUpdated.next([...this.posts]); */
        this.router.navigate(["/"]);
      });
  };
  //////



  ////

  deletePost(postId: string) {

    return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId);

  }

}
