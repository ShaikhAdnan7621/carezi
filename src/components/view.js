'use client'

import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
	ssr: false,
	loading: () => <p>Loading editor...</p>
});

const MarkdownView = ({ content }) => {
	return (
		<div className='markdown-view'>
			<QuillNoSSRWrapper
				value={content}
				readOnly={true}
				modules={{ toolbar: false }}
				formats={[]}
				style={{ backgroundColor: '#fff', minHeight: '200px' }}
			/>
			<style jsx global>
				{`
				.ql-editor {
					min-height: 200px;
				}
				.ql-container:{
					border: none;
				}
				.markdown-view {
					width: 100%;
				}`}
			</style>
		</div>
	);
};

export default MarkdownView;
