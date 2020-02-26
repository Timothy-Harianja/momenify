import React from 'react';

import './infinite-scroller.css';
import { render } from '@testing-library/react';


class InfiniteScroller extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: 20,
            loading: false
        };
    }
}

componentDidMount() {
    //Detect when scrolled to bottom
    this.refs.infinite-scroll.addEventListener("scroll", () => {
        if (
            this.refs.infinite-scroll.scrollTop + this.refs.infinite-scroll.clientHeight
            >= this.refs.infinite-scroll.scrollHeight
        ) {
            this.loadMoreItems();
        }
    })
}

showImages() {
    // get all the images from the 
}

loadMoreItems () {
    this.setState({loading: true});
    setTimeout(() => {
        this.setState ({images: this.state.images + 20, loading: false})
    })
}

render() {
    <div 
        className='Posts'
        ref="infinite-scroll"
    >
    <ul>
        {this.showImages()}
    </ul>
        {
            this.state.loading ?
            <p className="loading-text">
                loading more posts...
            </p>
            : ""
        } 
    </div>
}