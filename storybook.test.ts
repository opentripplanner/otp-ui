import initStoryshots from "@storybook/addon-storyshots";
import "jest-styled-components";

initStoryshots({
  asyncJest: true,
  test: async ({ story, done }) => {
    /* The default storyshot method renders components as if they
    were being rendered server-side. While this is good for many components,
    map-based components especially benefit from rendering as if they were 
    being rendered by a client. This results in more detailed and useful 
    snapshots. This method renders each story as if it were being rendered 
    by a browser, although with react syntax. A server-based render is done 
    below. */
    const jsx = await story.render();
    expect(jsx).toMatchSnapshot();
    done();
  }
});

// Also test using the default render method as it catches some changes
// the new method does not
initStoryshots();
