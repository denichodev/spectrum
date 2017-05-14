//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { displayLoadingCard } from '../../../components/loading';
import { ListCardItemUser } from '../../../components/listCardItem';
import { FlexRow, FlexCol } from '../../../components/globals';
import { LinkButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { unblockUserInFrequencyMutation } from '../../../api/frequency';
import {
  StyledCard,
  ListHeading,
  ListContainer,
  MoreLink,
  Description,
  Notice,
} from '../style';

class BlockedUsersWithMutation extends Component {
  constructor(props) {
    super(props);

    const { users } = this.props;

    this.state = {
      users,
    };
  }

  updateUsersList = uid => {
    this.setState(prevState => {
      return {
        ...prevState,
        users: prevState.users.filter(user => user.uid !== uid),
      };
    });
  };

  unblock = uid => {
    const { frequency: { id } } = this.props;

    const input = {
      id,
      uid,
    };

    this.props
      .unblockUser(input)
      .then(({ data: { unblockUser } }) => {
        const frequency = unblockUser;

        // the mutation returns a frequency object. if it exists,
        if (frequency !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'User was un-blocked.')
          );
          this.updateUsersList(uid);
        }
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err));
      });
  };

  render() {
    const { users } = this.state;
    const { frequency } = this.props;

    return (
      <StyledCard>
        <ListHeading>Blocked Users</ListHeading>
        {users.length > 0 &&
          <Description>
            Blocked users can not see stories or messages posted in this channel. They will still be able to join any other public channels in the Spectrum community and request access to other private channels.
          </Description>}

        {users.length > 0 &&
          <Notice>
            Unblocking a user will
            {' '}
            <b>not</b>
            {' '}
            add them to this channel. It will only allow them to re-request access in the future as long as this channel remains private.
          </Notice>}

        <ListContainer>
          {users &&
            users.map(user => {
              return (
                <section key={user.uid}>
                  <ListCardItemUser user={user}>
                    <LinkButton
                      onClick={() => this.unblock(user.uid)}
                      label
                      hoverColor={'warn.alt'}
                    >
                      Unblock
                    </LinkButton>
                  </ListCardItemUser>
                </section>
              );
            })}

          {users.length <= 0 &&
            <Description>
              There are no blocked users in this channel.
            </Description>}

        </ListContainer>
      </StyledCard>
    );
  }
}

const BlockedUsers = compose(unblockUserInFrequencyMutation)(
  BlockedUsersWithMutation
);
export default connect()(BlockedUsers);