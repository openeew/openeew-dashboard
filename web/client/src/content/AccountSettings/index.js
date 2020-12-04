import React, {useContext, useState} from "react";
import Field from "../../components/Field";
import SaveHeader from "../../components/SaveHeader";
import Title from "../../components/Title";
import { TextInput, Dropdown } from "carbon-components-react";
import Context from "../../context/app";
import "./AccountSettings.scss";

function AccountSettingsContent({ currentUser, isEditing, setEditing })
{
	return (
		<>
			<div className="userinfo_header">
				<span className="userinfo_title">User Information</span>
				<span
					className="userinfo_edit"
					onClick={() => setEditing(!isEditing)}
				>Edit</span>
			</div>
			<Field title="Name" value="Test Name" />
			<Field title="Language" value="English" />
			<Field title="Contact" value="test@example.com" />
			<Field title="User ID" value="123456789" />
		</>
	)
}

function AccountSettingsContentEdit({ currentUser, isEditing, setEditing })
{
	return (
		<div className="userinfo-edit">
			<TextInput id="input_name" placeholder="Test Name" labelText="Name" />
			<Dropdown id="dropdown_language" titleText="Language" label="English" items={["English"]} />
			<TextInput id="input_name" placeholder="test@example.com" labelText="Contact" />
			<TextInput id="input_name" value="123456789" labelText="User ID" readOnly={true} />
		</div>
	)
}

function AccountSettings() {
	const { currentUser } = useContext(Context);
	const [ isEditing, setEditing ] = useState(false);

	return (
		<>
			<Title>Profile</Title>
			<div className="userinfo-parent">
				{isEditing && (
					<SaveHeader
						title="User Information"
						onCancel={() => setEditing(false)}
						onSave={() => setEditing(false)}
					/>
				)}
				<div className="userinfo">
					{isEditing
						? (
							<AccountSettingsContentEdit
								currentUser={currentUser}
								isEditing={isEditing}
								setEditing={setEditing}
							/>
						)
						: (
							<AccountSettingsContent
								currentUser={currentUser}
								isEditing={isEditing}
								setEditing={setEditing}
							/>
						)
					}
				</div>
			</div>
		</>
	);
}

export default AccountSettings;
