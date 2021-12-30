<?php

namespace OCA\Photos\Listener;

use OCA\Photos\Db\ExcludedPathMapper;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\AbstractNodeEvent;
use OCP\Files\Events\Node\AbstractNodesEvent;
use OCP\Files\Events\Node\NodeCopiedEvent;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\Events\Node\NodeRenamedEvent;
use OCP\Files\Node;
use Psr\Log\LoggerInterface;

class NoMediaModifiedListener implements IEventListener {
	private LoggerInterface $logger;
	private ExcludedPathMapper $excludedPathMapper;

	/**
	 * @param LoggerInterface $logger
	 * @param ExcludedPathMapper $excludedPathMapper
	 */
	public function __construct(LoggerInterface $logger, ExcludedPathMapper $excludedPathMapper) {
		$this->logger = $logger;
		$this->excludedPathMapper = $excludedPathMapper;
	}

	public function handle(Event $event): void {
		if ($event instanceof AbstractNodeEvent) {
			if ($event instanceof NodeDeletedEvent) {
				// Remove the path from the exclusion list
				$this->handleDelete($event->getNode());
			} else {
				// Add the path to the exclusion list
				$this->handleAdd($event->getNode());
			}
		}

		if ($event instanceof AbstractNodesEvent) {
			if ($event instanceof NodeCopiedEvent) {
				// Ensure both source and target are included in the exclusion list
				$this->handleAdd($event->getSource());
				$this->handleAdd($event->getTarget());
			} elseif ($event instanceof NodeRenamedEvent) {
				// Remove source path from the exclusion list
				$this->handleDelete($event->getSource());
				// Add the target path to the exclusion list
				$this->handleAdd($event->getTarget());
			} else {
				// We don't support this event type, so log it
				$this->logger->warning('The event type ' . get_class($event) . ' is not supported');
			}
		}
	}

	private function handleAdd(Node $node) {
		if (!self::shouldHandle($node)) {
			return;
		}

		$this->logger->info('Adding a new excluded photo path');
		$this->excludedPathMapper->insertNode($node->getParent());
	}

	private function handleDelete(Node $node) {
		if (!self::shouldHandle($node)) {
			return;
		}

		$parent = $node->getParent();

		// If we still have a .nomedia or .noimage file in the folder, we don't want to remove the path
		if ($parent->nodeExists('.nomedia') || $parent->nodeExists('.noimage')) {
			return;
		}

		$this->logger->info('Removing an excluded photo path');
		$this->excludedPathMapper->deleteNode($parent);
	}

	/**
	 * Check if the given node is either a .nomedia or .noimage file, used to ignore a path from media scanning.
	 *
	 * @param Node $node
	 * @return bool whether the node is one we need to handle
	 */
	private static function shouldHandle(Node $node): bool {
		return $node->getName() === '.nomedia' || $node->getName() === '.noimage';
	}
}
