/**
 * BLOCK: heropress-widget
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const {
    InspectorControls,
} = wp.blockEditor;
import { useBlockProps, BlockAlignmentToolbar } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl } = wp.components;
const { Fragment } = wp.element;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-heropress-widget', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Heropress Widget' ), // Block title.
	icon: 'feedback', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'heropress-widget' ),
		__( 'heropress' ),
		__( 'press' ),
	],
	attributes: {
		essayMainTitle: {
			type: 'string',
		},
		essayPerPage: {
			type: 'number',
			default: 1
		},
		essayColumns: {
			type: 'number',
			default: 1
		},
		showImage: {
			type: 'boolean',
			default: false
		},
		showTitle: {
			type: 'boolean',
			default: false
		},
		showAuthor: {
			type: 'boolean',
			default: false
		},
		showPublishDate: {
			type: 'boolean',
			default: false
		},
		heropressData: {
			type: 'object',
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: ( props ) => {

		if (props.attributes.heropressData == undefined) {
			let fetchFeed = (async () => {
				let feedData = await fetch(admin_ajax.ajax_url + '?action=heropress_get_feed');
				return feedData.json();
			})();
			fetchFeed.then(feedDataJson => {
				props.setAttributes({
					heropressData: feedDataJson
				});
			})
		}

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ 'Heropress Widget Settings' }>
						<TextControl
							label={ 'Title:' }
							value={ props.attributes.essayMainTitle }
							onChange={ ( value ) => props.setAttributes( { essayMainTitle: value } ) }
						/>
						<SelectControl
							label="Show how many"
							value={props.attributes.essayPerPage}
							options={ [
								{ label: '1', value: 1 },
								{ label: '2', value: 2 },
								{ label: '3', value: 3 },
								{ label: '4', value: 4 },
								{ label: '5', value: 5 },
							] }
							onChange={ ( value ) => props.setAttributes( { essayPerPage: Number(value) } ) }
						/>
						<RangeControl 
							label="Columns"
							value={props.attributes.essayColumns}
							onChange={ ( value ) => props.setAttributes( { essayColumns: Number(value) } ) }
							min={ 1 }
							max={ props.attributes.essayPerPage }
						/>
						<ToggleControl
							label="Image"
							checked= {props.attributes.showImage}
							onChange={( value ) => props.setAttributes( { showImage: value } )}
						/>
						<ToggleControl
							label="Title"
							checked= {props.attributes.showTitle}
							onChange={( value ) => props.setAttributes( { showTitle: value } )}
						/>
						<ToggleControl
							label="Author"
							checked= {props.attributes.showAuthor}
							onChange={( value ) => props.setAttributes( { showAuthor: value } )}
						/>
						<ToggleControl
							label="Publish Date"
							checked= {props.attributes.showPublishDate}
							onChange={( value ) => props.setAttributes( { showPublishDate: value } )}
						/>
					</PanelBody>
				</InspectorControls>
			<h5>Please use the controls from settings menu on the right.</h5>
		</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	 save: ( props ) => { 
		const {
			essayMainTitle,
			essayPerPage,
			essayColumns,
			showImage,
			showTitle,
			showAuthor,
			showPublishDate,
			heropressData,
		} = props.attributes;
		const blockProps = useBlockProps.save();

		 return (
			<div { ...blockProps }>
				<h2>Inspector Control Fields</h2>
				<ul>
					<li>Main Title Field: { essayMainTitle }</li>
					<li>Essay Field: { essayPerPage }</li>
					<li>Columns Field: { essayColumns }</li>
					<li>Image Field: { showImage }</li>
					<li>Title Field: { showTitle }</li>
					<li>Author Field: { showAuthor }</li>
					<li>Publish Field: { showPublishDate }</li>
					<li>Data Field: { heropressData }</li>
				</ul>
			</div>
		 ); 
	}
} );
