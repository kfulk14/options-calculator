import React from 'react';
import { connect } from 'react-redux';

let Footer = (props) => (
	<div className="footer">
		<div className="container">
			<h2>About this page</h2>
			<div className="questions">
				<div className="row">
					<div className="question col-md-6">
						<h4>1. How accurate is this?</h4>
						<p>Not particularly accurate. In reality there are also capital gains taxes, AMT, preferred stock, and a bunch of other rubbish that should be factored into the equation.<br/>You should read <a href="http://www.danshapiro.com/blog/2010/11/how-much-are-startup-options-worth/" target="_blank">this article</a> by Dan Shapiro.</p>
					</div>
					<div className="question col-md-6">
						<h4>2. Why was this page created?</h4>
						<p>Valuing employee stock options (ISOs) is complicated. While this calculator is far from perfect, it can help you visualize how your options will vest over time.</p>
					</div>
				</div>
				<div className="row">
					<div className="question col-md-6">
						<h4>3. Are you collecting this data?</h4>
						<p>No data is collected, and if you'd like to verify that you can view the project source code on <a href="https://github.com/schnerd/options-calculator" target="_blank">Github</a>. Your entries are persisted on your browser for convenience, and you can <a href="#" onClick={props.onForget}>click here</a> to clear them at any time.</p>
					</div>
					<div className="question col-md-6">
						<h4>4. Am I going to be rich?</h4>
						<p>Probably not. But maybe.</p>
					</div>
				</div>
			</div>

			<div className="links">
				<span>By <a href="https://twitter.com/dschnr" target="_blank">@dschnr</a></span>
				&nbsp;&middot;&nbsp;
				<span>Source code available on <a href="https://github.com/schnerd/options-calculator" target="_blank">Github</a></span>
			</div>
		</div>
	</div>
);

export default connect(
	null,
	function mapDispatchToProps(dispatch) {
		return {
			onForget() {
				dispatch({
					type: 'SET_STATE',
					state: {}
				});
			}
		};
	}
)(Footer);
