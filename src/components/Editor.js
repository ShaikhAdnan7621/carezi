'use client'

import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
	ssr: false,
	loading: () => <p>Loading editor...</p>
});

const Editor = ({ value, onChange }) => {

	const handleChange = (content) => {
		onChange(content);
		console.log(content)
	};

	const modules = {
		toolbar: [
			[{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			['bold', 'italic', 'underline'],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'align': [] }],
			['link'],
			['clean']
		],
	};

	return (
		<div className='editor-wrapper w-full overflow-auto '>
			<QuillNoSSRWrapper
				value={value}
				onChange={handleChange}
				modules={modules}
				formats={[
					'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
					'color', 'background', 'align', 'link', 'image'
				]}
				style={{ backgroundColor: '#fff', overflow : 'auto', maxHeight: '1000px' }}
			/>
			<style jsx global>
				{`
				.ql-editor {
					min-height: 200px;
				}`}
			</style>
		</div>
	);
};

export default Editor;
