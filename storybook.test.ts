import initStoryshots from "@storybook/addon-storyshots";
import "jest-styled-components";

initStoryshots({
  asyncJest: true,
  test: async ({ story, done }) => {
    const jsx = await story.render();
    expect(jsx).toMatchSnapshot();
    done();
  }
});
