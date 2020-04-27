import React, { Component } from "react";
import PostsContainer from "../posts-container/posts-container";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import "./body.css";
import TopRightContainer from "../posts-container/top-right-container";
import TrendContainer from "../posts-container/trend-container";
import CreatePost from "../create-post/create-post";
import axios from "axios";
import PostItem from "../post-item/post-item";
import logo1 from "../images/logo1.png";
import logo2 from "../images/logo2.png";
import logo3 from "../images/logo3.png";
import logo4 from "../images/logo4.png";
import logo5 from "../images/logo5.png";
import logo6 from "../images/logo6.png";
import logo7 from "../images/logo7.png";
import logo8 from "../images/logo1.png";
import logo9 from "../images/logo9.png";
import one from "../images/one.png";
import two from "../images/two.png";
import three from "../images/three.png";
import four from "../images/four.png";
import five from "../images/five.png";
import trend from "../images/trend.png";
class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      posts: 0,
      idList: [],
      moments: [],
      usernameList: [],
      postidList: [],
      loadingFeedback: "Loading More...",
      likeStatus: [],
      numofLike: [],
      message: [],
      userLogo: [],
      commentList: [],
      postDateList: [],
      hashtagList: [],
      topTrendList: [],
      loadStatus: false,
      filesList: [],
      visitedList: [],
    };
  }

  componentDidMount() {
    axios.get("/api/getRoute/getHashtag").then((res) => {
      if (res.data.success) {
        this.setState({ topTrendList: res.data.hashtagList });
      }
    });
    axios
      .get("/api/loginRoute/session")
      .then((res) => {
        this.setState({
          userId: res.data.userId,
          logoNumber: res.data.logoNumber,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.queryPost();
  }
  queryPost = () => {
    axios
      .post("/api/getRoute/getMoment", { visitedList: this.state.postidList })
      .then((res) => {
        for (let i = 0; i < res.data.allMoments.length; i++) {
          this.state.idList.push(res.data.idList[i]);
          this.state.moments.push(res.data.allMoments[i]);
          this.state.usernameList.push(res.data.allUsername[i]);
          this.state.postidList.push(res.data.allPostid[i]);
          this.state.likeStatus.push(false);
          this.state.numofLike.push(res.data.numofLike[i]);
          this.state.userLogo.push(res.data.logoList[i]);
          this.state.commentList.push(res.data.commentList[i]);
          this.state.postDateList.push(res.data.postDateList[i]);
          this.state.hashtagList.push(res.data.hashtagList[i]);
          this.state.filesList.push(res.data.filesList[i]);
          this.state.posts++;
        }
        this.setState({
          loadStatus: true,
          loadingFeedback:
            res.data.allMoments.length == 0
              ? "No More New Posts, Come Back Later :)"
              : "Loading More...",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  giveComment = (comment) => {
    if (comment.postComment != null && comment.postComment.trim() != "") {
      axios
        .post("/api/postRoute/postComment", comment)
        .then((res) => {
          if (res.data.success == false) {
            alert("Please login to make a comment!");
          } else {
            let newCommentList = this.state.commentList;
            newCommentList[comment.position].push(res.data.message);
            this.setState({ commentList: newCommentList });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Comment cannot be empty!");
    }
  };

  giveLike = (post) => {
    let postId = post.postid;
    axios
      .post("/api/postRoute/giveLike", { postId: postId })
      .then((res) => {
        if (res.data.success) {
          let newlikeStatus = this.state.likeStatus;
          newlikeStatus[post.position] = true;
          let newnumofLike = this.state.numofLike;
          newnumofLike[post.position] += 1;
          this.setState({ likeStatus: newlikeStatus });
          this.setState({ numofLike: newnumofLike });
        } else {
          this.setState({ likeMessage: res.data.message });
          if (res.data.message == "you already liked this post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "you already liked this post";
            alert("you already liked this post");
            this.setState({ message: newMessage });
          }
          if (res.data.message == "please login to like a post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "please login to like a post";
            alert("please login to like a post");
            this.setState({ message: newMessage });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getLogo = (num) => {
    let list = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9];
    return list[parseInt(num) - 1];
  };

  getNumberLogo = (num) => {
    let list = [one, two, three, four, five];
    return list[parseInt(num)];
  };
  showPosts = () => {
    // get all the posts from the
    var posts = [];

    if (this.state.loadStatus) {
      for (let i = 0; i < this.state.posts; i++) {
        posts.push(
          <div key={i} className="post">
            <PostItem
              username={
                this.state.usernameList[i] == undefined
                  ? "Anonymous"
                  : this.state.usernameList[i]
              }
              id={this.state.idList[i]}
              postDate={this.state.postDateList[i]}
              text={this.state.moments[i]}
              likeStatus={this.state.message[i]}
              profileUrl={
                this.state.usernameList[i] == undefined
                  ? "https://momenify.s3.us-east-2.amazonaws.com/default.png"
                  : this.state.userLogo[i]
              }
              postid={this.state.postidList[i]}
              position={i}
              commentsCount={this.state.commentList[i].length}
              giveLike={(e) => this.giveLike(e)}
              giveComment={(e) => this.giveComment(e)}
              likeStatus={this.state.likeStatus[i]}
              numofLike={this.state.numofLike[i]}
              hashtags={this.state.hashtagList[i]}
              comment={this.state.commentList[i]}
              file={this.state.filesList[i]}
            />
          </div>
        );
      }
    }
    return posts;
  };

  addNewPost = (newPost) => {
    let newMoments = [newPost.postmessage, ...this.state.moments];
    let newPostidList = [newPost.postId, ...this.state.postidList];
    let newUsernameList = [newPost.username, ...this.state.usernameList];
    let newLikeStatus = [false, ...this.state.likeStatus];
    let newNumofLike = [0, ...this.state.numofLike];
    let newMessage = ["", ...this.state.message];
    let newLogoList = [newPost.logoNumber, ...this.state.userLogo];
    let newCommentlist = [[], ...this.state.commentList];
    let newPostDateList = [newPost.postDate, ...this.state.postDateList];
    let newHashtagList = [newPost.hashtagList, ...this.state.hashtagList];
    let newIDList = [newPost.userID, ...this.state.idList];
    let newFilesList = [newPost.file, ...this.state.filesList];

    this.setState({
      idList: newIDList,
      moments: newMoments,
      postidList: newPostidList,
      usernameList: newUsernameList,
      likeStatus: newLikeStatus,
      numofLike: newNumofLike,
      Message: newMessage,
      userLogo: newLogoList,
      commentList: newCommentlist,
      postDateList: newPostDateList,
      hashtagList: newHashtagList,
      posts: this.state.posts + 1,
      filesList: newFilesList,
    });
  };

  render() {
    return (
      <div className="body">
        <div className="create-post-container">
          <div className="create-post-div">
            <CreatePost addNewPost={(newPost) => this.addNewPost(newPost)} />
          </div>
        </div>

        <div className="home-page">
          <div className="main-posts-container">
            <PostsContainer
              postContent={this.state.postContent}
              resetPostContent={() => this.resetNewPost()}
              loadMorePosts={() => this.queryPost()}
              showPosts={() => this.showPosts()}
              giveLike={(post) => this.giveLike(post)}
              state={this.state}
            />
          </div>
          <div className="side-posts-container">
            <div className="wrapper">
              <div className="box top">
                <div>
                  <img
                    src={
                      this.state.userId == null
                        ? "https://momenify.s3.us-east-2.amazonaws.com/default.png"
                        : this.state.logoNumber
                    }
                    alt="kun"
                    id="side-profile"
                  />
                  <button id="follower">Followers</button>
                  <button id="following">Following</button>
                </div>
                <TopRightContainer />
              </div>
              <div className="box middle">
                <div id="trending-hashtag">
                  <img src={trend} alt="kun" className="trend-img" />
                  &nbsp;&nbsp;&nbsp;Trending:
                </div>
                <span class="line-fade"></span>
                <div id="trend-list">
                  <ul>
                    {this.state.topTrendList.map((tag, index) => (
                      <a href={"/hashtag/" + tag.substring(1)}>
                        <li>
                          <img
                            src={this.getNumberLogo(index)}
                            alt="kun"
                            className="trend-img"
                          />
                          <h3>{tag}</h3>
                        </li>
                      </a>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="box-bottom box">
                <a href="/about-us">About</a>
                <a href="/privacy">Privacy</a>
                <a href="/term-of-use">Terms of Use</a>
                <a href="/careers">Careers</a>
              </div>
              <p style={{ color: "grey" }}> Momenify © 2020</p>
            </div>
          </div>
        </div>
        {/* <div className='side-posts-container'>
          <PostsContainer/>
        </div> */}
        <ScrollUpButton />
      </div>
    );
  }
}

export default Body;
