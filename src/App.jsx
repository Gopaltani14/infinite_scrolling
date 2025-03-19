import { useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import './App.css';
import { fetchItems } from './items';
import { useInView } from 'react-intersection-observer';
import { FixedSizeList as List } from 'react-window';  // Importing react-window for virtualization

function App() {
  // Fetching data with React Query's useInfiniteQuery
  const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Intersection Observer to track when the last item is in view (for infinite scrolling)
  // const { ref, inView } = useInView();

  // Fetch the next page of data when the user scrolls to the bottom (inView is true)
  // useEffect(() => {
  //   if (inView && hasNextPage) fetchNextPage();  // Only fetch if there's a next page
  // }, [fetchNextPage, inView, hasNextPage]);

  // Flatten all fetched pages into a single array
  const allItems = data ? data.pages.flatMap(page => page.data) : [];

  // Track the scrolling position in react-window for triggering infinite scrolling
  const listRef = useRef();

  // const handleScroll = useCallback(() => {
  //   const list = listRef.current;
  //   if (list) {
  //     const { scrollOffset, scrollHeight, clientHeight } = list;
  //     // If scrolled to the bottom of the list, fetch the next page
  //     if (scrollOffset + clientHeight >= scrollHeight - 100 && hasNextPage && !isFetchingNextPage) {
  //       fetchNextPage();
  //     }
  //   }
  // }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // // Add scroll listener to the react-window list for infinite scrolling
  // useEffect(() => {
  //   const listElement = listRef.current?.outerRef?.current;
  //   if (listElement) {
  //     listElement.addEventListener('scroll', handleScroll);
  //   }
  //   return () => {
  //     if (listElement) {
  //       listElement.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, [handleScroll]);

  // Detect when the last item is rendered and trigger the fetch
  const handleItemsRendered = ({ visibleStopIndex }) => {
    if (visibleStopIndex === allItems.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return status === "pending" ? (
    <div style={{ color: "white", padding: "20px" }}>Loading...</div>
  ) : status === "error" ? (
    <div style={{ color: "white", padding: "20px" }}>{error.message}</div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Virtualized List */}
      <div style={{ overflowX: "hidden"}}>
        <List
          ref={listRef}                          // Reference to the list for scrolling
          height={window.innerHeight}                           // Fixed height for the list viewport
          itemCount={allItems.length}            // The total number of items to render
          itemSize={100}                          // Fixed height for each item (same as your earlier setup)
          width={window.innerWidth - 12} 
          onItemsRendered={handleItemsRendered}                         // Set width of the list container 
        >
          {({ index, style }) => (
            <div style={{ ...style }}>
              {allItems[index] ? (
                <div
                key={index}
                style={{ height:"50%", padding: '10px', border: '1px solid grey', borderRadius: "10px", margin: '10px', backgroundColor: "rgba(241, 242, 247, 0.151)", color: "white" }}>
                  {allItems[index].name}
                </div>
              ) : (
                <div style={{ padding: '10px', color: 'white' }}>Loading...</div>
              )}
            </div>
          )}
        </List>

        {/* Status Message or Loading Indicator */}
        {/* <div ref={ref} style={{ color: "white" }}> */}
        <div style={{ color: "white" }}>
          {isFetchingNextPage ? "Loading more..." : !hasNextPage ? "No more items!" : null}
        </div>
      </div>
      
    </div>
  );
}

export default App;
