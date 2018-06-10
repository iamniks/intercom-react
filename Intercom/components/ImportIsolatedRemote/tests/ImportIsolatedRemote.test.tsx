import * as React from 'react';
import {mount} from 'enzyme';
import ImportIsolatedRemote from '..';

describe('<ImportIsolatedRemote />', () => {
  const mockProps = {
    title: 'some-title',
    source: 'https://js.intercomcdn.com/shim.d862c967.js',
    onImported: () => {},
  };

  it('renders an iframe', async () => {
    const node = await mount(<ImportIsolatedRemote {...mockProps} />);
    expect(node.find('iframe').exists()).toBeTruthy();
  });

  it('uses the given className', async () => {
    const node = await mount(
      <ImportIsolatedRemote {...mockProps} className="some-class" />,
    );
    expect(node.find('iframe').prop('className')).toBe('some-class');
  });

  it('imports the given source', async () => {
    const onImportedSpy = jest.fn();
    const node = await mount(
      <ImportIsolatedRemote {...mockProps} onImported={onImportedSpy} />,
    );
    const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
    const script = iframeNode.contentWindow!.document.querySelector('script');
    expect(script!.src).toBe(mockProps.source);
  });

  it('triggers onImported when the script has loaded', async () => {
    const onImportedSpy = jest.fn();
    const node = await mount(
      <ImportIsolatedRemote {...mockProps} onImported={onImportedSpy} />,
    );

    const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
    const script = iframeNode.contentWindow!.document.querySelector('script');
    const callback = script!.onload!;

    callback.call(script, {} as Event);
    expect(onImportedSpy).toBeCalled();
  });

  it('doesnt trigger onImported when the script loads after the component has already been unmounted', async () => {
    const onImportedSpy = jest.fn();
    const node = await mount(
      <ImportIsolatedRemote {...mockProps} onImported={onImportedSpy} />,
    );
    const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
    const script = iframeNode.contentWindow!.document.querySelector('script');

    node.unmount();

    expect(script!.onload!).toBeNull();
    expect(onImportedSpy).not.toBeCalled();
  });
});